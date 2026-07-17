import { Request, Response, NextFunction } from "express";

import { issueNonce, consumeNonce } from "../utils/nonce";
import { checkRateLimit } from "../utils/rateLimit";
import {
  isContactDbConfigured,
  saveContactSubmission,
} from "../services/contactService";

// Mirrors the parked_site contact flow:
// nonce check -> rate limit -> validate -> enrich -> insert.
// Every response (success or error) includes a fresh nonce so the
// client can resubmit without an extra round trip.

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 255;
const MAX_MESSAGE = 5000;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getContactNonce(_req: Request, res: Response) {
  return res.json({ nonce: issueNonce() });
}

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const fail = (status: number, message: string) =>
    res.status(status).json({ error: true, message, nonce: issueNonce() });

  try {
    if (!isContactDbConfigured()) {
      return fail(503, "Contact form is not available right now.");
    }

    if (!consumeNonce(req.body?.nonce)) {
      return fail(403, "Unverified request. Please try again.");
    }

    if (!checkRateLimit(req.ip ?? "unknown", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      return fail(429, "Too many submissions. Please try again later.");
    }

    const firstName = asTrimmedString(req.body?.firstName);
    const lastName = asTrimmedString(req.body?.lastName);
    const email = asTrimmedString(req.body?.email);
    const message = asTrimmedString(req.body?.message);

    if (!firstName || !lastName) {
      return fail(400, "First and last name are required.");
    }
    if (!email || !EMAIL_RE.test(email) || email.length > MAX_EMAIL) {
      return fail(400, "A valid email address is required.");
    }
    if (firstName.length > MAX_NAME || lastName.length > MAX_NAME) {
      return fail(400, "Name is too long.");
    }
    if (message.length > MAX_MESSAGE) {
      return fail(400, "Message is too long.");
    }

    await saveContactSubmission({
      firstName,
      lastName,
      email,
      message: message || null,
      ip: req.ip ?? null,
      userAgent: req.get("user-agent") ?? null,
      referrer: req.get("referer") ?? null,
    });

    return res.json({
      error: false,
      message: "Thank you! I'll be in touch soon.",
      nonce: issueNonce(),
    });
  } catch (e) {
    console.error("Contact form DB error:", e);
    return fail(500, "Something went wrong. Please try again later.");
  }
}
