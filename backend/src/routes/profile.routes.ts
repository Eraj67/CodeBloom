import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import * as profileService from "../services/profile.service";
import { updateProfileSchema } from "../validators/profile.validator";

const router = Router();

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.userId!);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const input = updateProfileSchema.parse(req.body);
    const profile = await profileService.updateProfile(req.userId!, input);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

export default router;
