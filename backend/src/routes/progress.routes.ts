import { ProgressItemType } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import * as progressService from "../services/progress.service";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const progress = await progressService.listProgress(req.userId!);
    res.json({ progress });
  } catch (error) {
    next(error);
  }
});

router.get("/summary", requireAuth, async (req, res, next) => {
  try {
    const summary = await progressService.getProgressSummary(req.userId!);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

router.post("/lessons/:lessonId/complete", requireAuth, async (req, res, next) => {
  try {
    const progress = await progressService.completeItem(
      req.userId!,
      ProgressItemType.lesson,
      req.params.lessonId
    );
    res.status(201).json({ progress });
  } catch (error) {
    next(error);
  }
});

router.post("/challenges/:challengeId/complete", requireAuth, async (req, res, next) => {
  try {
    const progress = await progressService.completeItem(
      req.userId!,
      ProgressItemType.challenge,
      req.params.challengeId
    );
    res.status(201).json({ progress });
  } catch (error) {
    next(error);
  }
});

export default router;
