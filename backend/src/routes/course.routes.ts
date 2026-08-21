import { Router } from "express";
import * as courseService from "../services/course.service";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const courses = await courseService.listCourses();
    res.json({ courses });
  } catch (error) {
    next(error);
  }
});

router.get("/lessons/:lessonId", async (req, res, next) => {
  try {
    const lesson = await courseService.getLesson(req.params.lessonId);
    res.json({ lesson });
  } catch (error) {
    next(error);
  }
});

router.get("/:courseId", async (req, res, next) => {
  try {
    const course = await courseService.getCourse(req.params.courseId);
    res.json({ course });
  } catch (error) {
    next(error);
  }
});

export default router;
