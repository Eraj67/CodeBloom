import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    user: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

import { prisma } from "../../src/lib/prisma";
import { createApp } from "../../src/app";
import type { Express } from "express";

let app: Express;
let passwordHash: string;

beforeEach(async () => {
  vi.clearAllMocks();
  app = createApp();
  passwordHash = await bcrypt.hash("password123", 10);
  vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) => cb(prisma));
});

const user = {
  id: "user-1",
  email: "test.user@example.com",
  createdAt: new Date("2026-01-01"),
  profile: { displayName: "Test User", bio: null, avatarUrl: null, updatedAt: new Date("2026-01-01") },
};

function mockAuthUser() {
  vi.mocked(prisma.user.findUnique).mockResolvedValue({
    ...user,
    passwordHash,
    tokenVersion: 0,
  } as any);
}

describe("POST /api/auth/signup", () => {
  it("creates a user and sets the auth cookie", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null); // duplicate check
    vi.mocked(prisma.user.create).mockResolvedValue(user as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ tokenVersion: 0 } as any); // signToken

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test.user@example.com", password: "password123", displayName: "Test User" });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("test.user@example.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 400 for validation failures", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "not-an-email", password: "short" });
    expect(res.status).toBe(400);
  });

  it("returns 409 for a duplicate email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "existing" } as any);
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test.user@example.com", password: "password123" });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email already registered");
  });
});

describe("POST /api/auth/login", () => {
  it("logs in and sets the auth cookie", async () => {
    mockAuthUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "  TEST.USER@example.com  ", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("test.user@example.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 401 for a wrong password", async () => {
    mockAuthUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test.user@example.com", password: "wrong-password" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the current user with a valid cookie", async () => {
    mockAuthUser();
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({ email: "test.user@example.com", password: "password123" });

    const res = await agent.get("/api/auth/me");
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("user-1");
  });

  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the auth cookie", async () => {
    mockAuthUser();
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({ email: "test.user@example.com", password: "password123" });

    const res = await agent.post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});

describe("PATCH /api/auth/password", () => {
  it("changes the password and invalidates old tokens", async () => {
    mockAuthUser();
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({ email: "test.user@example.com", password: "password123" });

    const res = await agent
      .patch("/api/auth/password")
      .send({ currentPassword: "password123", newPassword: "newpassword456" });
    expect(res.status).toBe(200);

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ tokenVersion: { increment: 1 } }) })
    );
  });

  it("returns 401 for a wrong current password", async () => {
    mockAuthUser();
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({ email: "test.user@example.com", password: "password123" });

    const res = await agent
      .patch("/api/auth/password")
      .send({ currentPassword: "wrong", newPassword: "newpassword456" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Current password is incorrect");
  });
});