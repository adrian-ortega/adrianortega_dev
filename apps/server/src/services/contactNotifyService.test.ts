import { describe, it, expect, jest } from "@jest/globals";
import {
  buildContactEmail,
  getNotifyConfig,
  sendContactNotification,
} from "./contactNotifyService";
import type { ContactSubmission } from "./contactService";

const submission: ContactSubmission = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  message: "Hello there\nSecond line",
  ip: "203.0.113.5",
  userAgent: "jest",
  referrer: "https://adrianortega.dev/contact",
};

const env = {
  RESEND_API_KEY: "re_test",
  CONTACT_NOTIFY_TO: "me@example.com, other@example.com",
  CONTACT_NOTIFY_FROM: "adrianortega.dev <contact@ortegas.co>",
} as NodeJS.ProcessEnv;

function okFetch() {
  return jest.fn(async (_url: string, _init: RequestInit) => ({
    ok: true,
    status: 200,
    text: async () => "{}",
  }));
}

describe("getNotifyConfig", () => {
  it("is null unless key, from and to are all set", () => {
    expect(getNotifyConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(getNotifyConfig({ ...env, RESEND_API_KEY: "" })).toBeNull();
    expect(getNotifyConfig({ ...env, CONTACT_NOTIFY_FROM: " " })).toBeNull();
    expect(getNotifyConfig({ ...env, CONTACT_NOTIFY_TO: " , " })).toBeNull();
  });

  it("splits recipients", () => {
    expect(getNotifyConfig(env)?.to).toEqual(["me@example.com", "other@example.com"]);
  });
});

describe("buildContactEmail", () => {
  it("includes the message, name and reply-to", () => {
    const mail = buildContactEmail(submission, getNotifyConfig(env)!);
    expect(mail.reply_to).toBe("ada@example.com");
    expect(mail.subject).toBe("[adrianortega.dev] Message from Ada Lovelace");
    expect(mail.text).toContain("Hello there\nSecond line");
    expect(mail.text).toContain("Email: ada@example.com");
    expect(mail.from).toBe(env.CONTACT_NOTIFY_FROM);
  });

  it("keeps CR/LF out of the subject", () => {
    const mail = buildContactEmail(
      { ...submission, firstName: "Evil\r\nBcc: x@y.z" },
      getNotifyConfig(env)!,
    );
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });

  it("handles an empty message", () => {
    const mail = buildContactEmail({ ...submission, message: null }, getNotifyConfig(env)!);
    expect(mail.text).toContain("(no message)");
  });
});

describe("sendContactNotification", () => {
  it("does nothing when not configured", async () => {
    const f = okFetch();
    expect(await sendContactNotification(submission, { env: {} as NodeJS.ProcessEnv, fetchImpl: f })).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it("posts to Resend with the bearer key", async () => {
    const f = okFetch();
    expect(await sendContactNotification(submission, { env, fetchImpl: f })).toBe(true);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body as string).reply_to).toBe("ada@example.com");
  });

  it("returns false (no throw) on a Resend error or network failure", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const bad = jest.fn(async () => ({ ok: false, status: 403, text: async () => "nope" }));
    expect(await sendContactNotification(submission, { env, fetchImpl: bad })).toBe(false);
    const boom = jest.fn(async () => {
      throw new Error("offline");
    });
    expect(await sendContactNotification(submission, { env, fetchImpl: boom })).toBe(false);
    spy.mockRestore();
  });
});
