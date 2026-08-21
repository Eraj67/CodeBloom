import { describe, expect, it, vi, beforeEach, afterAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    user: { findUnique: vi.fn() },
    profile: { findUnique: vi.fn(), update: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

import { prisma } from "../../src/lib/prisma";
import { createApp } from "../../src/app";
import { env } from "../../src/config/env";

const app = createApp();

const profile = {
  id: "profile-1",
  userId: "user-1",
  displayName: "Jane",
  bio: null,
  avatarUrl: null,
  updatedAt: new Date("2026-01-01"),
};

const createdFiles: string[] = [];

function withAuth() {
  const token = jwt.sign({ userId: "user-1", tokenVersion: 0 }, env.JWT_SECRET);
  return { Cookie: `token=${token}` };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ tokenVersion: 0 } as any);
});

afterAll(() => {
  for (const file of createdFiles) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
});

describe("GET /api/profile/me", () => {
  it("returns the profile with a valid cookie", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(profile as any);
    const res = await request(app).get("/api/profile/me").set(withAuth());
    expect(res.status).toBe(200);
    expect(res.body.profile.displayName).toBe("Jane");
  });

  it("returns 401 without a cookie", async () => {
    const res = await request(app).get("/api/profile/me");
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/profile/me", () => {
  it("accepts null displayName and bio (cleared fields)", async () => {
    vi.mocked(prisma.profile.update).mockResolvedValue({ ...profile, displayName: null, bio: null } as any);
    const res = await request(app)
      .patch("/api/profile/me")
      .set(withAuth())
      .send({ displayName: null, bio: null });
    expect(res.status).toBe(200);
    expect(res.body.profile.displayName).toBeNull();
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { displayName: null, bio: null },
    });
  });

  it("updates provided fields", async () => {
    vi.mocked(prisma.profile.update).mockResolvedValue({ ...profile, bio: "new bio" } as any);
    const res = await request(app)
      .patch("/api/profile/me")
      .set(withAuth())
      .send({ bio: "new bio" });
    expect(res.status).toBe(200);
    expect(res.body.profile.bio).toBe("new bio");
  });

  it("returns 400 for invalid fields", async () => {
    const res = await request(app)
      .patch("/api/profile/me")
      .set(withAuth())
      .send({ bio: 123 });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/profile/avatar", () => {
  it("rejects an invalid file type with 400", async () => {
    const res = await request(app)
      .post("/api/profile/avatar")
      .set(withAuth())
      .attach("avatar", Buffer.from("not an image"), { filename: "fake.png", contentType: "text/plain" });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid file type");
  });

  it("uploads a valid image and serves it from the API origin", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({ ...profile, avatarUrl: null } as any);
    vi.mocked(prisma.profile.update).mockImplementation(async (_args: any) => {
      const filename = path.basename((_args.data as any).avatarUrl);
      createdFiles.push(path.join(process.cwd(), "uploads", "avatars", filename));
      return { ...profile, avatarUrl: (_args.data as any).avatarUrl } as any;
    });

    const png = Buffer.from("89504e470d0a1a0a", "hex");
    const res = await request(app)
      .post("/api/profile/avatar")
      .set(withAuth())
      .attach("avatar", png, { filename: "avatar.png", contentType: "image/png" });

    expect(res.status).toBe(200);
    expect(res.body.profile.avatarUrl).toMatch(/http:\/\/127\.0\.0\.1:\d+\/uploads\/avatars\//);
    expect(prisma.profile.update).toHaveBeenCalled();
  });
});