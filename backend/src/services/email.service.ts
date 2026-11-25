import { Resend } from "resend";
import { env } from "../config/env";
import { AppError } from "../lib/errors";

const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

  export async function sendVerificationEmail(
  email: string,
  token: string
) {
  if (!resend) {
    console.log(
      "[verification] RESEND_API_KEY not set — email skipped."
    );
    return;
  }

  const verificationUrl =
    `${env.FRONTEND_URL}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: "CodeBloom <onboarding@resend.dev>",
    to: email,
    subject: "Verify your CodeBloom account",
    text: `Welcome to CodeBloom!

Please verify your email by visiting:

${verificationUrl}

This link expires in 24 hours.`,
  });

  if (error) {
    throw new AppError(502, "Failed to send verification email");
  }
}