import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
import { Config } from "../config/env.js";

// ─── Buyer / General user guard ───────────────────────────────────────────────
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, Config.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!req.user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "User is not verified" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

// ─── Seller guard ─────────────────────────────────────────────────────────────
export const authenticateSeller = async (req, res, next) => {
  let token;

  // BUG FIX: mirror protect's dual-source token reading (cookie + Bearer header)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, Config.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== "seller") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};
