import { Resend } from "resend";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { ContactInput } from "../validators/contact.validator";

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

async function sendContactEmail(input: ContactInput) {
  if (!env.RESEND_API_KEY) {
    console.log("[contact] RESEND_API_KEY not set — email skipped, message stored in DB.");
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "CodeBloom <onboarding@resend.dev>",
    to: env.CONTACT_EMAIL_TO,
    replyTo: input.email,
    subject: `[CodeBloom Contact] ${input.subject}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });

  if (error) {
    throw new AppError(502, "Failed to send contact email");
  }
}

export async function submitContact(input: ContactInput) {
  if (input.website) {
    throw new AppError(400, "Invalid submission");
  }

  const sanitized = {
    name: stripHtml(input.name),
    email: input.email,
    subject: stripHtml(input.subject),
    message: stripHtml(input.message),
  };

  const message = await prisma.contactMessage.create({ data: sanitized });

  await sendContactEmail(sanitized);

  return {
    id: message.id,
    message: "Thanks for reaching out. We'll get back to you soon.",
  };
}
