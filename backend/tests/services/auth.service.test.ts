import { describe, expect, it, vi, beforeEach } from "vitest";
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
import {
  changePassword,
  getCurrentUser,
  login,
  signup,
} from "../../src/services/auth.service";

const createdUser = {
  id: "user-1",
  email: "test.user@example.com",
  createdAt: new Date("2026-01-01"),
  profile: { displayName: "Test User", bio: null, avatarUrl: null, updatedAt: new Date("2026-01-01") },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) => cb(prisma));
});

describe("signup", () => {
  it("normalizes the email before checking and creating", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);

    await signup({
      email: "  TEST.User@Example.com  ",
      password: "password123",
      displayName: "  Test User  ",
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test.user@example.com" },
    });
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "test.user@example.com",
          profile: expect.objectContaining({ create: { displayName: "  Test User  " } }),
        }),
      })
    );
  });

  it("rejects a duplicate email with 409", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "existing" } as any);
    await expect(
      signup({ email: "test.user@example.com", password: "password123" })
    ).rejects.toMatchObject({ statusCode: 409, message: "Email already registered" });
  });

  it("hashes the password with bcrypt", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);

    await signup({ email: "test.user@example.com", password: "password123" });

    const data = (vi.mocked(prisma.user.create).mock.calls[0] as any)[0].data;
    expect(data.passwordHash).not.toBe("password123");
    await expect(bcrypt.compare("password123", data.passwordHash)).resolves.toBe(true);
  });
});

describe("login", () => {
  const realHash = "$2b$10$7JvHwQdHn1Vvg0zpHiH3Fe9ZbCzqzJQXm2T0Wj5cEa1Qa4hN9m1Gq"; // not used; real hash below

  it("normalizes the email when looking up the user", async () => {
    const hash = await bcrypt.hash("password123", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...createdUser,
      passwordHash: hash,
    } as any);

    await login({ email: "  TEST.USER@example.com  ", password: "password123" });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test.user@example.com" },
      select: expect.any(Object),
    });
    void realHash;
  });

  it("returns the user without the passwordHash", async () => {
    const hash = await bcrypt.hash("password123", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...createdUser,
      passwordHash: hash,
    } as any);

    const user = await login({ email: "test.user@example.com", password: "password123" });
    expect(user).not.toHaveProperty("passwordHash");
    expect(user.email).toBe("test.user@example.com");
  });

  it("rejects an unknown email with 401", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await expect(
      login({ email: "nobody@example.com", password: "password123" })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it("rejects a wrong password with 401", async () => {
    const hash = await bcrypt.hash("password123", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...createdUser,
      passwordHash: hash,
    } as any);
    await expect(
      login({ email: "test.user@example.com", password: "wrong-password" })
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

describe("getCurrentUser", () => {
  it("returns the user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(createdUser as any);
    await expect(getCurrentUser("user-1")).resolves.toEqual(createdUser);
  });

  it("throws 404 when missing", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await expect(getCurrentUser("missing")).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("changePassword", () => {
  it("rejects a wrong current password with 401", async () => {
    const hash = await bcrypt.hash("password123", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ passwordHash: hash } as any);
    await expect(
      changePassword("user-1", { currentPassword: "wrong", newPassword: "newpassword456" })
    ).rejects.toMatchObject({ statusCode: 401, message: "Current password is incorrect" });
  });

  it("updates the hash and increments tokenVersion", async () => {
    const hash = await bcrypt.hash("password123", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ passwordHash: hash } as any);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    await changePassword("user-1", {
      currentPassword: "password123",
      newPassword: "newpassword456",
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: expect.objectContaining({
        passwordHash: expect.not.stringMatching(/^password123$/),
        tokenVersion: { increment: 1 },
      }),
    });
  });
});