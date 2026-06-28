# Environment Variables

This is the definitive list of environment variables for the Dine-Ease pickle
storefront. Copy `backend/.env.example` → `backend/.env` and
`frontend/DineEase/.env.example` → `frontend/DineEase/.env`, then fill in values.

> ⚠️ The charge/tax values **must match** between backend and frontend, or every
> checkout is rejected with "Price updated, Please retry".

---

## Backend (`backend/.env`)

| Variable | Required? | Purpose | Example / Notes |
|---|---|---|---|
| `DATABASE_URL` | **Required** | PostgreSQL connection string for Prisma. Server exits on boot if missing. | `postgresql://user:pass@host:5432/dineease` |
| `JWT_SECRET` | **Required** | Secret used to sign/verify JWTs. Server exits on boot if missing. | A long random string. Rotate on AWS via Secrets Manager. |
| `MAIL_JET_PUBLIC_KEY` | Required for email | Mailjet public key — OTP + order-confirmation emails. | Server boots without it but OTP/order emails are disabled (logged). |
| `MAIL_JET_PRIVATE_KEY` | Required for email | Mailjet private key. | — |
| `CLOUD_NAME` | Required for images | Cloudinary cloud name — product image upload/delete. | — |
| `API_KEY` | Required for images | Cloudinary API key. | — |
| `API_SECRET` | Required for images | Cloudinary API secret. | — |
| `SHIPPING_COST` | Required for checkout | Flat shipping added to every order total. | `65` — must equal frontend `VITE_SHIPPING_COST`. |
| `COD` | Required for checkout | Cash-on-delivery surcharge. | `40` — must equal frontend `VITE_COD`. |
| `TAX_RATE` | Required for checkout | Tax percentage applied to the order. | `12` — must equal frontend `VITE_TAX_RATE`. |
| `PORT` | Optional | HTTP listen port. | Defaults to `3000`. On AWS, set per the target (e.g. ECS task port). |
| `CORS_ORIGIN` | Recommended (prod) | Comma-separated allowlist of frontend origins. If unset, **all** origins are allowed (dev convenience). | `https://shop.example.com,https://www.example.com` |
| `NODE_ENV` | Recommended (prod) | Set to `production` on AWS. Switches the logger to JSON output (CloudWatch-friendly) and the log level to `info`. | `production` |
| `LOG_LEVEL` | Optional | Override log verbosity: `trace`\|`debug`\|`info`\|`warn`\|`error`\|`fatal`\|`silent`. | Defaults to `debug` (dev) / `info` (prod). |

**Minimum to boot:** `DATABASE_URL`, `JWT_SECRET`.
**Minimum for full functionality:** all of the above except `PORT`/`LOG_LEVEL`.

---

## Frontend (`frontend/DineEase/.env`)

Vite inlines these at **build time** — rebuild the frontend after changing them.

| Variable | Required? | Purpose | Example / Notes |
|---|---|---|---|
| `VITE_API_URL` | **Required** | Backend API base URL (trailing slash). Falls back to a hardcoded prod URL if unset. | `http://localhost:3000/` |
| `VITE_SHIPPING_COST` | **Required** | Shipping shown/used in checkout math. | `65` — must equal backend `SHIPPING_COST`. |
| `VITE_COD` | **Required** | COD surcharge in checkout math. | `40` — must equal backend `COD`. |
| `VITE_TAX_RATE` | **Required** | Tax percentage in checkout math. | `12` — must equal backend `TAX_RATE`. |

> `VITE_SHIPPING_COST` / `VITE_COD` / `VITE_TAX_RATE` now fall back to `0` (via
> `numEnv()` in `src/config/api.ts`) if unset, so a missing value no longer makes
> the total `NaN` — but it will still mismatch the backend, so always set them.

---

## Logging on AWS

- The backend logs **structured JSON to stdout** in production (`NODE_ENV=production`).
  CloudWatch / ECS / Lambda capture stdout automatically — no file config needed.
- Every HTTP request is logged once with a generated **`x-request-id`** (returned
  as a response header and present on every related log line) for tracing.
- Sensitive fields (passwords, OTPs, auth headers, tokens) are redacted.
- Query in CloudWatch Logs Insights, e.g.:
  `fields @timestamp, msg, req.method, req.url, res.statusCode, level | filter level = "error"`
- A `GET /health` endpoint is available for load-balancer / ECS health checks.

## Secrets on AWS

The repo currently contains real values in `backend/.env` / `frontend/.env`.
Before/after moving to AWS: **rotate these secrets**, store them in AWS Secrets
Manager or SSM Parameter Store, inject them as task/environment variables, and
keep the `.env` files out of version control (they should be gitignored).
