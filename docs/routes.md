# API routes (apps/server)

All routes are mounted under `/api` (JSON body parser applied). Anything else
is served from the built web app (SPA fallback).

| Method | Path | Handler | Notes |
|---|---|---|---|
| GET | `/api/health` | healthRouter | liveness |
| GET | `/api/pages` | pagesRouter | |
| GET | `/api/pages/:slug` | pagesRouter | |
| GET | `/api/posts` | postsRouter | |
| GET | `/api/posts/:slug` | postsRouter | |
| GET | `/api/posts/:slug/related` | postsRouter | |
| GET | `/api/tags` | tagsRouter | |
| GET | `/api/tags/:slug` | tagsRouter | |
| GET | `/api/sidebars/:slug` | sidebarsRouter | |
| GET | `/api/widgets/:slug` | widgetsRouter | |
| GET | `/api/notifications/:slug` | notificationsRouter | site notification banners (markdown), not email |
| GET | `/api/contact/nonce` | getContactNonce | fresh CSRF nonce |
| POST | `/api/contact` | submitContact | nonce → rate limit (3/h per IP) → validate → save to MySQL → **email Adrian via Resend** |

## POST /api/contact side effects

1. Inserts a row into `contact_submissions` (unchanged).
2. If `RESEND_API_KEY`, `CONTACT_NOTIFY_TO` and `CONTACT_NOTIFY_FROM` are all
   set, sends a plain-text "new message" email (name, email, message, IP,
   user agent, referrer) with `Reply-To` set to the sender. Fire-and-forget
   with a 5 s timeout; a failure is logged and never changes the response.
