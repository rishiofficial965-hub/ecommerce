import { Router } from "express";
import {
  validationRegisterUser,
  validationLoginUser,
} from "../validator/auth.validator.js";
import {
  registerHandler,
  loginHandler,
  googleCallbackHandler,
  verifyOTP,
  sendOTP,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { protect } from "../middleware/auth.middleware.js";

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

// BUG FIX: Removed `protect` middleware — user has no JWT yet at this stage.
// BUG FIX: Changed /send-otp from GET to POST (it mutates data — creates a new OTP).
router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendOTP);

export default router;
