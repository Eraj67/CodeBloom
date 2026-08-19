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

// This file only tests rate limiting. The auth router's rate limiter is a
// module level singleton, so this file must not make other requests that
// would consume the limit. A fresh app is created per test.
let app = createApp();

beforeEach(async () => {
  vi.clearAllMocks();
  app = createApp();
  const hash = await bcrypt.hash("password123", 10);
  vi.mocked(prisma.user.findUnique).mockResolvedValue({
    id: "user-1",
    email: "test.user@example.com",
    createdAt: new Date("2026-01-01"),
    profile: { displayName: null, bio: null, avatarUrl: null, updatedAt: new Date("2026-01-01") },
    passwordHash: hash,
    tokenVersion: 0,
  } as any);
});

describe("auth rate limiting", () => {
  it("blocks login attempts after the limit is reached", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 21; i++) {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test.user@example.com", password: "wrong-password" });
      statuses.push(res.status);
    }

    expect(statuses.slice(0, 20).every((s) => s === 401)).toBe(true);
    expect(statuses[20]).toBe(429);
  });
});