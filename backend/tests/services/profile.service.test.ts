import { describe, expect, it, vi, beforeEach } from "vitest";
import fs from "fs";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    user: { findUnique: vi.fn() },
    profile: { findUnique: vi.fn(), update: vi.fn() },
    userProgress: { findMany: vi.fn(), count: vi.fn() },
    lesson: { findMany: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

import { prisma } from "../../src/lib/prisma";
import {
  getProfile,
  getProfileStats,
  updateProfile,
  uploadAvatar,
} from "../../src/services/profile.service";

const profile = {
  id: "profile-1",
  userId: "user-1",
  displayName: "Jane",
  bio: null,
  avatarUrl: null,
  updatedAt: new Date("2026-01-01"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getProfile", () => {
  it("returns the profile", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(profile as any);
    await expect(getProfile("user-1")).resolves.toEqual(profile);
  });

  it("throws 404 when missing", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);
    await expect(getProfile("user-1")).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("updateProfile", () => {
  it("maps null displayName and bio through (cleared fields)", async () => {
    vi.mocked(prisma.profile.update).mockResolvedValue({ ...profile, displayName: null, bio: null } as any);
    await updateProfile("user-1", { displayName: null, bio: null });
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { displayName: null, bio: null },
    });
  });

  it("maps an empty avatarUrl to null", async () => {
    vi.mocked(prisma.profile.update).mockResolvedValue({ ...profile, avatarUrl: null } as any);
    await updateProfile("user-1", { avatarUrl: "" });
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { avatarUrl: null },
    });
  });

  it("maps a null avatarUrl to null", async () => {
    vi.mocked(prisma.profile.update).mockResolvedValue({ ...profile, avatarUrl: null } as any);
    await updateProfile("user-1", { avatarUrl: null });
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { avatarUrl: null },
    });
  });

  it("keeps a provided avatarUrl as-is", async () => {
    const url = "http://localhost:4000/uploads/avatars/a.png";
    vi.mocked(prisma.profile.update).mockResolvedValue({ ...profile, avatarUrl: url } as any);
    await updateProfile("user-1", { avatarUrl: url });
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { avatarUrl: url },
    });
  });

  it("omits fields that were not provided", async () => {
    vi.mocked(prisma.profile.update).mockResolvedValue(profile as any);
    await updateProfile("user-1", { bio: "new bio" });
    const call = (vi.mocked(prisma.profile.update).mock.calls[0] as any)[0];
    expect(call.data).toEqual({ bio: "new bio" });
  });
});

describe("getProfileStats", () => {
  it("throws 404 when the user is missing", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.userProgress.findMany).mockResolvedValue([] as any);
    vi.mocked(prisma.userProgress.count).mockResolvedValue(0);
    await expect(getProfileStats("missing")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("builds memberSince and completion stats", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ createdAt: new Date("2026-01-01") } as any);
    vi.mocked(prisma.userProgress.findMany).mockResolvedValue([
      { itemId: "html-lesson-01" },
      { itemId: "html-lesson-02" },
      { itemId: "css-lesson-01" },
    ] as any);
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([
      { courseId: "html" },
      { courseId: "html" },
      { courseId: "css" },
    ] as any);
    vi.mocked(prisma.userProgress.count).mockResolvedValue(2);

    const stats = await getProfileStats("user-1");
    expect(stats).toEqual({
      memberSince: new Date("2026-01-01"),
      lessonsByCourse: { html: 2, css: 1 },
      completedChallenges: 2,
      totalCompletedLessons: 3,
    });
  });
});

describe("uploadAvatar", () => {
  const file = { filename: "user-1-123.png", mimetype: "image/png", size: 100 } as Express.Multer.File;

  it("throws 404 when the profile is missing", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);
    await expect(uploadAvatar("user-1", file, "http://localhost:4000")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("builds the avatar URL from the request origin", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({ ...profile, avatarUrl: null } as any);
    vi.mocked(prisma.profile.update).mockResolvedValue({
      ...profile,
      avatarUrl: "http://localhost:4000/uploads/avatars/user-1-123.png",
    } as any);

    await uploadAvatar("user-1", file, "http://localhost:4000");
    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      data: { avatarUrl: "http://localhost:4000/uploads/avatars/user-1-123.png" },
    });
  });

  it("deletes the previous avatar file", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      ...profile,
      avatarUrl: "http://localhost:4000/uploads/avatars/old.png",
    } as any);
    const existsSpy = vi.spyOn(fs, "existsSync").mockReturnValue(true);
    const unlinkSpy = vi.spyOn(fs, "unlinkSync").mockImplementation(() => {});

    await uploadAvatar("user-1", file, "http://localhost:4000");
    expect(unlinkSpy).toHaveBeenCalledWith(expect.stringContaining("old.png"));

    existsSpy.mockRestore();
    unlinkSpy.mockRestore();
  });
});