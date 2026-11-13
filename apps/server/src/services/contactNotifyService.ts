import type { ContactSubmission } from "./contactService";

// Sends Adrian a "you got a message" email through Resend's HTTP API after a
// contact submission has been saved. Storage is unchanged; this is a
// best-effort side effect and never fails the request.
//
// Env (all required for notifications to be sent; otherwise it's a no-op):
//   RESEND_API_KEY       sending-only Resend key for this site
//   CONTACT_NOTIFY_TO    where notifications go (comma-separated allowed)
//   CONTACT_NOTIFY_FROM  sender on a Resend-verified domain,
//                        e.g. "adrianortega.dev <contact@ortegas.co>"

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 5000;

export type ContactEmail = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
};

export type NotifyConfig = {
  apiKey: string;
  to: string[];
  from: string;
  site: string;
};

export function getNotifyConfig(
  env: NodeJS.ProcessEnv = process.env,
): NotifyConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.CONTACT_NOTIFY_FROM?.trim();
  const to = (env.CONTACT_NOTIFY_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!apiKey || !from || to.length === 0) return null;
  return { apiKey, from, to, site: env.CONTACT_NOTIFY_SITE?.trim() || "adrianortega.dev" };
}

// Strip CR/LF so user input can't break the subject line.
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function buildContactEmail(
  s: ContactSubmission,
  cfg: Pick<NotifyConfig, "from" | "to" | "site">,
): ContactEmail {
  const name = oneLine(`${s.firstName} ${s.lastName}`).slice(0, 120);
  const lines = [
    `New contact form message on ${cfg.site}`,
    "",
    `Name:  ${name}`,
    `Email: ${s.email}`,
    "",
    s.message || "(no message)",
    "",
    "--",
    `IP: ${s.ip ?? "unknown"}`,
    `User agent: ${s.userAgent ?? "unknown"}`,
    `Referrer: ${s.referrer ?? "none"}`,
    "Reply to this email to answer the sender directly.",
  ];
  return {
    from: cfg.from,
    to: cfg.to,
    reply_to: s.email,
    subject: oneLine(`[${cfg.site}] Message from ${name}`).slice(0, 200),
    text: lines.join("\n"),
  };
}

type FetchLike = (url: string, init: RequestInit) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

export async function sendContactNotification(
  s: ContactSubmission,
  opts: { env?: NodeJS.ProcessEnv; fetchImpl?: FetchLike } = {},
): Promise<boolean> {
  const cfg = getNotifyConfig(opts.env);
  if (!cfg) return false;
  const doFetch: FetchLike = opts.fetchImpl ?? fetch;
  try {
    const res = await doFetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildContactEmail(s, cfg)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      const body = (await res.text()).slice(0, 300);
      console.error(`Contact notify failed: Resend ${res.status} ${body}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Contact notify error:", e);
    return false;
  }
}
