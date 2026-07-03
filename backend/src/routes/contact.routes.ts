import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as contactService from "../services/contact.service";
import { contactSchema } from "../validators/contact.validator";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many contact submissions. Please try again later." },
});

router.post("/", contactLimiter, async (req, res, next) => {
  try {
    const input = contactSchema.parse(req.body);
    const result = await contactService.submitContact(input);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
