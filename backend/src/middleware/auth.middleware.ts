import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";

export const AUTH_COOKIE = "token";

interface JwtPayload {
  userId: string;
  tokenVersion: number;
}

const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function expiresInToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return DEFAULT_MAX_AGE_MS;

  const amount = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * multipliers[unit];
}

export async function signToken(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenVersion: true },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return jwt.sign(
    { userId, tokenVersion: user.tokenVersion },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresInToMs(env.JWT_EXPIRES_IN),
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.[AUTH_COOKIE];

  if (!token) {
    next(new AppError(401, "Unauthorized"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { tokenVersion: true },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      next(new AppError(401, "Invalid or expired token"));
      return;
    }

    req.userId = payload.userId;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
