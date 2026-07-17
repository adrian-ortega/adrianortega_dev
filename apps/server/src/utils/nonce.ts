import crypto from "node:crypto";

// Stateless HMAC-signed nonces (no session store needed).
// Format: <id>.<issuedAtBase36>.<hmacSignature>
// A nonce is valid if the signature checks out, it hasn't expired,
// and it hasn't been consumed before (replay protection).

const SECRET =
  process.env.CONTACT_NONCE_SECRET || crypto.randomBytes(32).toString("hex");
const TTL_MS = 15 * 60 * 1000; // 15 minutes

// Consumed nonce ids -> expiry timestamp. Pruned on use.
const consumed = new Map<string, number>();

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

function prune(now: number) {
  for (const [id, expiresAt] of consumed) {
    if (expiresAt < now) consumed.delete(id);
  }
}

export function issueNonce(): string {
  const id = crypto.randomBytes(16).toString("hex");
  const ts = Date.now().toString(36);
  return `${id}.${ts}.${sign(`${id}.${ts}`)}`;
}

export function consumeNonce(nonce: unknown): boolean {
  if (typeof nonce !== "string") return false;
  const parts = nonce.split(".");
  if (parts.length !== 3) return false;

  const [id, ts, sig] = parts;
  const expected = sign(`${id}.${ts}`);
  const sigBuf = Buffer.from(sig, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return false;
  }

  const issuedAt = parseInt(ts, 36);
  const now = Date.now();
  if (!Number.isFinite(issuedAt) || now - issuedAt > TTL_MS) return false;

  if (consumed.has(id)) return false; // replay
  prune(now);
  consumed.set(id, issuedAt + TTL_MS);
  return true;
}
