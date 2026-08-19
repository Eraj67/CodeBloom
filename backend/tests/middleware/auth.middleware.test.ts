import { describe, expect, it, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { AppError } from "../../src/lib/errors";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    user: { findUnique: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

import { prisma } from "../../src/lib/prisma";
import { env } from "../../src/config/env";
import { requireAuth, signToken } from "../../src/middleware/auth.middleware";

function makeRequest() {
  return { cookies: {} } as any;
}

function makeResponse() {
  const res: any = {};
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
}

function makeNext() {
  return vi.fn();
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("signToken", () => {
  it("embeds the user's current tokenVersion", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ tokenVersion: 3 } as any);
    const token = await signToken("user-1");
    const payload = jwt.verify(token, env.JWT_SECRET) as any;
    expect(payload.userId).toBe("user-1");
    expect(payload.tokenVersion).toBe(3);
  });

  it("throws 404 when the user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await expect(signToken("missing")).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("requireAuth", () => {
  it("rejects a missing cookie with 401", async () => {
    const req = makeRequest();
    const next = makeNext();
    await requireAuth(req, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    expect(req.userId).toBeUndefined();
  });

  it("rejects an invalid token with 401", async () => {
    const req = makeRequest();
    req.cookies.token = "garbage-token";
    const next = makeNext();
    await requireAuth(req, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("rejects a token whose tokenVersion is stale", async () => {
    const token = jwt.sign({ userId: "user-1", tokenVersion: 1 }, env.JWT_SECRET);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ tokenVersion: 2 } as any);
    const req = makeRequest();
    req.cookies.token = token;
    const next = makeNext();
    await requireAuth(req, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: "Invalid or expired token" })
    );
  });

  it("rejects when the user no longer exists", async () => {
    const token = jwt.sign({ userId: "user-1", tokenVersion: 0 }, env.JWT_SECRET);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    const req = makeRequest();
    req.cookies.token = token;
    const next = makeNext();
    await requireAuth(req, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("sets userId for a valid token and matching version", async () => {
    const token = jwt.sign({ userId: "user-1", tokenVersion: 0 }, env.JWT_SECRET);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ tokenVersion: 0 } as any);
    const req = makeRequest();
    req.cookies.token = token;
    const next = makeNext();
    await requireAuth(req, makeResponse(), next);
    expect(req.userId).toBe("user-1");
    expect(next).toHaveBeenCalledWith();
  });

  it("verifies against the DB version even on a good signature", async () => {
    const token = jwt.sign({ userId: "user-1", tokenVersion: 0 }, env.JWT_SECRET);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ tokenVersion: 5 } as any);
    const req = makeRequest();
    req.cookies.token = token;
    const next = makeNext();
    await requireAuth(req, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    expect(new AppError(401, "x")).toBeInstanceOf(AppError);
  });
});