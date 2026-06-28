import pino from "pino";

// -----------------------------------------------------------------------------
//  Structured logger (pino)
// -----------------------------------------------------------------------------
//  - In production: emits one-line JSON to stdout. This is exactly what AWS
//    CloudWatch / ECS / Lambda expect — no file handling, no rotation needed.
//  - In development: pretty-prints via pino-pretty for readability.
//  - Level is controlled by LOG_LEVEL (trace|debug|info|warn|error|fatal);
//    defaults to "debug" in dev and "info" in prod.
//  - Sensitive fields (passwords, OTPs, auth headers) are redacted.
// -----------------------------------------------------------------------------

const isProd = process.env.NODE_ENV === "production";
// Pretty-print only in local dev — not in prod (JSON for CloudWatch) and not in
// tests (avoids spawning a pino-pretty worker thread under the test runner).
const usePretty = !isProd && process.env.NODE_ENV !== "test";
const level = process.env.LOG_LEVEL || (isProd ? "info" : "debug");

export const logger = pino({
  level,
  base: {
    service: "dine-ease-backend",
    env: process.env.NODE_ENV || "development",
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "*.password",
      "otp",
      "*.otp",
      "hashedotp",
      "token",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
  formatters: {
    // Emit the level as a string ("info") rather than a number (30) — friendlier
    // for CloudWatch Logs Insights queries.
    level(label) {
      return { level: label };
    },
  },
  ...(usePretty
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname,service,env",
          },
        },
      }
    : {}),
});

export type Logger = typeof logger;
