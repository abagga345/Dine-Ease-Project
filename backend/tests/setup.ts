// Runs before any test module is imported. Sets a test environment so that
// importing the app (which validates env + reads JWT_SECRET) does not exit the
// process, and so the logger stays silent.
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "silent";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";
// Charge/tax values used by checkout math (kept in sync with frontend in real envs).
process.env.SHIPPING_COST = process.env.SHIPPING_COST || "65";
process.env.COD = process.env.COD || "40";
process.env.TAX_RATE = process.env.TAX_RATE || "12";
