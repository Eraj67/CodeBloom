import { Router } from "express";
import {
  clearAuthCookie,
  requireAuth,
  setAuthCookie,
  signToken,
} from "../middleware/auth.middleware";
import * as authService from "../services/auth.service";
import {
  changePasswordSchema,
  loginSchema,
  signupSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body);
    const user = await authService.signup(input);
    const token = signToken(user.id);
    setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await authService.login(input);
    const token = signToken(user.id);
    setAuthCookie(res, token);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", requireAuth, (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.userId!);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.patch("/password", requireAuth, async (req, res, next) => {
  try {
    const input = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.userId!, input);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
