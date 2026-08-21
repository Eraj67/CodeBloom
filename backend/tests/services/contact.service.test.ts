import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../src/lib/prisma", () => {
  const prisma = {
    contactMessage: { create: vi.fn() },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return { prisma };
});

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { prisma } from "../../src/lib/prisma";
import { env } from "../../src/config/env";
import { submitContact } from "../../src/services/contact.service";

const input = {
  name: "Jane <script>alert(1)</script>",
  email: "jane@example.com",
  subject: "Hello <b>there</b>",
  message: "This is a real message body",
};

beforeEach(() => {
  vi.clearAllMocks();
  (env as any).RESEND_API_KEY = "";
});

afterEach(() => {
  (env as any).RESEND_API_KEY = "";
});

describe("submitContact", () => {
  it("rejects submissions that fill the honeypot website field", async () => {
    await expect(submitContact({ ...input, website: "http://spam.example" })).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
  });

  it("stores the message and strips HTML", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({ id: "msg-1" } as any);
    const result = await submitContact(input);
    expect(prisma.contactMessage.create).toHaveBeenCalledWith({
      data: {
        name: "Jane alert(1)",
        email: "jane@example.com",
        subject: "Hello there",
        message: "This is a real message body",
      },
    });
    expect(result.id).toBe("msg-1");
  });

  it("skips sending an email when no Resend API key is configured", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({ id: "msg-1" } as any);
    await submitContact(input);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("still succeeds when the email send fails after saving", async () => {
    (env as any).RESEND_API_KEY = "test-key";
    sendMock.mockRejectedValueOnce(new Error("resend down"));
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({ id: "msg-1" } as any);
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await submitContact(input);
    expect(result.id).toBe("msg-1");
    expect(prisma.contactMessage.create).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("sends the email when a key is configured", async () => {
    (env as any).RESEND_API_KEY = "test-key";
    sendMock.mockResolvedValue({ error: null });
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({ id: "msg-1" } as any);

    await submitContact(input);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "jane@example.com",
        subject: expect.stringContaining("Hello "),
      })
    );
  });
});