import { Router } from "express";
import {
  validationRegisterUser,
  validationLoginUser,
} from "../validator/auth.validator.js";
import {
  registerHandler,
  loginHandler,
  googleCallbackHandler,
} from "../controllers/auth.controller.js";
import passport from "passport";
const router = Router();

router.post("/register", validationRegisterUser, registerHandler);
router.post("/login", validationLoginUser, loginHandler);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  googleCallbackHandler,
);

export default router;
