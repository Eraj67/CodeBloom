import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import * as profileService from "../services/profile.service";
import { updateProfileSchema } from "../validators/profile.validator";
import { upload } from "../lib/multer";

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

router.get("/stats", requireAuth, async (req, res, next) => {
  try {
    const stats = await profileService.getProfileStats(req.userId!);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/avatar",
  requireAuth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const origin = `${req.protocol}://${req.get("host")}`;
      const profile = await profileService.uploadAvatar(req.userId!, req.file, origin);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
