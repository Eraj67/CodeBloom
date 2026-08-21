import { describe, expect, it } from "vitest";
import { updateProfileSchema } from "../../src/validators/profile.validator";

describe("updateProfileSchema", () => {
  it("accepts a normal payload", () => {
    const result = updateProfileSchema.safeParse({
      displayName: "Jane",
      bio: "Hello world",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null displayName and bio (cleared fields)", () => {
    const result = updateProfileSchema.safeParse({ displayName: null, bio: null });
    expect(result.success).toBe(true);
  });

  it("accepts an empty string avatarUrl (clears avatar)", () => {
    const result = updateProfileSchema.safeParse({ avatarUrl: "" });
    expect(result.success).toBe(true);
  });

  it("accepts a null avatarUrl", () => {
    const result = updateProfileSchema.safeParse({ avatarUrl: null });
    expect(result.success).toBe(true);
  });

  it("accepts a valid avatar URL", () => {
    const result = updateProfileSchema.safeParse({ avatarUrl: "http://localhost:4000/uploads/avatars/a.png" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid avatar URL", () => {
    const result = updateProfileSchema.safeParse({ avatarUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects a display name that is a number", () => {
    const result = updateProfileSchema.safeParse({ displayName: 123 });
    expect(result.success).toBe(false);
  });

  it("rejects an over-long bio", () => {
    const result = updateProfileSchema.safeParse({ bio: "x".repeat(501) });
    expect(result.success).toBe(false);
  });
});