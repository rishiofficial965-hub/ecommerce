import { Router } from "express";
import { validationRegisterUser } from "../validator/auth.validator.js";
import { registerHandler } from "../controllers/auth.controller.js";
const router = Router();

router.post("/register", validationRegisterUser, registerHandler);

export default router;
