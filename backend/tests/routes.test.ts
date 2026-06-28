import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/index";

// These exercise the real Express pipeline (logging, routing, validation, auth)
// without touching the database — they hit code paths that return before any
// Prisma call.
describe("HTTP pipeline", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("attaches an x-request-id correlation header to responses", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["x-request-id"]).toBeTruthy();
  });

  it("POST /api/v1/user/signin with invalid body returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/user/signin")
      .send({ email: "x" }); // too short + missing password
    expect(res.status).toBe(400);
  });

  it("POST /api/v1/user/checkout without auth returns 401", async () => {
    const res = await request(app).post("/api/v1/user/checkout").send({});
    expect(res.status).toBe(401);
  });

  it("unknown route returns 404", async () => {
    const res = await request(app).get("/api/v1/does-not-exist");
    expect(res.status).toBe(404);
  });
});
