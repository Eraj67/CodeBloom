import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import {
  ChangePasswordInput,
  LoginInput,
  SignupInput,
} from "../validators/auth.validator";

const BCRYPT_ROUNDS = 12;

const userSelect = {
  id: true,
  email: true,
  createdAt: true,
  profile: {
    select: {
      displayName: true,
      bio: true,
      avatarUrl: true,
      updatedAt: true,
    },
  },
} as const;

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        profile: {
          create: {
            displayName: input.displayName ?? null,
          },
        },
      },
      select: userSelect,
    });

    return created;
  });

  return user;
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { ...userSelect, passwordHash: true },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);

  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);

  if (!valid) {
    throw new AppError(401, "Current password is incorrect");
  }

  const newPasswordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });
}
