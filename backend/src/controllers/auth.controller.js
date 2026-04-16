import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Config } from "../config/env.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOTP.js";
import { otpTemplate } from "../utils/emailTemplate.js";

const createToken = (id) => {
  return jwt.sign({ id }, Config.JWT_SECRET, { expiresIn: "7d" });
};

async function sendTokenResponse(user, res, message) {
  const token = createToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    role: user.role,
  });

  return res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
}

export const registerHandler = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or contact already exists",
      });
    }

    const otp = generateOTP();

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
      otp: {
        code: otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      },
    });

    const htmlContent = otpTemplate(otp, fullname);

    try {
      await sendEmail(
        email,
        "Verify Your Email — Snitch",
        `Your OTP is ${otp}`,
        htmlContent,
      );
    } catch (emailError) {
      console.error("Registration email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message:
        "Account created. Please verify your email with the OTP sent to " +
        email,
      userId: user._id,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Login failed. Please try again." });
  }
};

export const googleCallbackHandler = async (req, res) => {
  try {
    const { id, displayName, emails } = req.user;
    const email = emails[0].value;
    let isUserExist = await userModel.findOne({ email });

    if (!isUserExist) {
      isUserExist = await userModel.create({
        email: email,
        fullname: displayName,
        googleId: id,
        isVerified: true,
      });
    }
    const token = createToken(isUserExist._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("http://localhost:5173");
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.redirect("http://localhost:5173/login?error=oauth_failed");
  }
};

export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "userId and OTP are required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    if (user.otp.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.otp.code !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP. Please try again." });
    }

    user.isVerified = true;
    user.otp.code = undefined;
    user.otp.expiresAt = undefined;
    await user.save();

    await sendTokenResponse(
      user,
      res,
      "Email verified successfully! Welcome to Snitch.",
    );
  } catch (err) {
    console.error("VerifyOTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};

export const sendOTP = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    await user.save();

    const htmlContent = otpTemplate(otp, user.fullname);
    await sendEmail(
      user.email,
      "Verify Your Email — Snitch",
      `Your OTP is ${otp}`,
      htmlContent,
    );

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("SendOTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is not verified" });
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    await user.save();

    const htmlContent = otpTemplate(otp, user.fullname);
    await sendEmail(
      user.email,
      "Verify Your Email — Snitch",
      `Your OTP is ${otp}`,
      htmlContent,
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("ForgetPassword error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { userId, otp , newPassword ,confirmPassword} = req.body;

  if (!userId || !otp || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "userId and OTP and newPassword and confirmPassword are required" });
  }

  try {
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    if (user.otp.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.otp.code !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP. Please try again." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp.code = undefined;
    user.otp.expiresAt = undefined;
    await user.save();

    await sendTokenResponse(
      user,
      res,
      "Password reset successfully! Welcome to Snitch.",
    );
  } catch (err) {
    console.error("VerifyOTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};
