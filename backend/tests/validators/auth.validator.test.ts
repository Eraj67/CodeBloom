import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  loginSchema,
  signupSchema,
} from "../../src/validators/auth.validator";

describe("signupSchema", () => {
  it("accepts a valid signup payload", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "password123",
      displayName: "Jane",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 8 characters");
    }
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("trims and lowercases the email", () => {
    const result = signupSchema.parse({
      email: "  USER@Example.COM  ",
      password: "password123",
    });
    expect(result.email).toBe("user@example.com");
  });

  it("trims the display name", () => {
    const result = signupSchema.parse({
      email: "user@example.com",
      password: "password123",
      displayName: "  Jane  ",
    });
    expect(result.displayName).toBe("Jane");
  });

  it("makes displayName optional", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("trims and lowercases the email before validation", () => {
    const result = loginSchema.parse({
      email: "  TEST.USER@Example.com ",
      password: "password123",
    });
    expect(result.email).toBe("test.user@example.com");
  });

  it("requires a password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "nope",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("requires both current and new password", () => {
    const result = changePasswordSchema.safeParse({ currentPassword: "old", newPassword: "newpassword123" });
    expect(result.success).toBe(true);
  });

  it("rejects a new password shorter than 8 characters", () => {
    const result = changePasswordSchema.safeParse({ currentPassword: "old", newPassword: "short" });
    expect(result.success).toBe(false);
  });
});