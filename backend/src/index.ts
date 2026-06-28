import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import pinoHttp from "pino-http";
import { mainRouter } from "./Routes/index";
import { activeRequestCount, requestCount, requestDuration } from "./Monitoring/prom";
import { logger } from "./logger";

// Startup env validation: hard-fail on truly required vars.
const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
const missingRequired = requiredEnv.filter((key) => !process.env[key]);
if (missingRequired.length > 0) {
  logger.fatal(
    { missing: missingRequired },
    "Missing required environment variables. Set them (see .env.example) and restart."
  );
  process.exit(1);
}

// Warn (but don't exit) for partial-functionality vars.
const warnEnv = [
  "MAIL_JET_PUBLIC_KEY",
  "MAIL_JET_PRIVATE_KEY",
  "CLOUD_NAME",
  "API_KEY",
  "API_SECRET",
  "SHIPPING_COST",
  "COD",
  "TAX_RATE",
];
const missingWarn = warnEnv.filter((key) => !process.env[key]);
if (missingWarn.length > 0) {
  logger.warn(
    { missing: missingWarn },
    "Missing optional environment variables. Related features may not work correctly."
  );
}

const app = express();

// ---------------------------------------------------------------------------
//  HTTP request logging + correlation IDs
//  pino-http logs one structured line per request (method, url, status,
//  responseTime) and attaches a per-request child logger at `req.log` that
//  carries the request id — use it inside handlers for correlated step logs.
// ---------------------------------------------------------------------------
app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const incoming = req.headers["x-request-id"];
      const id = (Array.isArray(incoming) ? incoming[0] : incoming) || randomUUID();
      res.setHeader("x-request-id", id);
      return id;
    },
    // Map response status to log level so 4xx => warn, 5xx => error.
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} ${res.statusCode} - ${err.message}`,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

// CORS allowlist driven by CORS_ORIGIN (comma-separated). Falls back to
// permissive if unset so local dev isn't broken.
const corsOriginEnv = process.env.CORS_ORIGIN;
if (corsOriginEnv) {
  const allowedOrigins = corsOriginEnv
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
  app.use(cors({ origin: allowedOrigins }));
  logger.info({ allowedOrigins }, "CORS restricted to allowlist");
} else {
  app.use(cors());
  logger.warn("CORS_ORIGIN not set — allowing all origins (development mode)");
}

app.use(express.json());
app.use(requestCount);
app.use(activeRequestCount);
app.use(requestDuration);

// Lightweight health check for load balancers / ECS / k8s probes.
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/v1", mainRouter);

// 404 fallback for unmatched API routes.
app.use((req: Request, res: Response) => {
  req.log.warn("Route not found");
  res.status(404).json({ message: "Not found" });
});

// Centralized error handler — logs every error that bubbles up with the
// request id already attached by pino-http, then returns a safe response.
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({ err }, "Unhandled error in request pipeline");
  if (res.headersSent) return;
  res.status(500).json({ message: "INTERNAL SERVER ERROR" });
});

// Crash-safety: log fatal process-level errors before exit so they reach
// CloudWatch instead of vanishing.
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
});
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception — shutting down");
  process.exit(1);
});

// Only start the HTTP listener when run directly (`node dist/index.js`).
// When imported by tests (supertest), the app is used without binding a port.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info({ port: PORT }, "Server started");
  });
}

export { app };
