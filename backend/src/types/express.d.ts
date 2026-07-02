import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};

export type AuthenticatedRequest = Request & { userId: string };
