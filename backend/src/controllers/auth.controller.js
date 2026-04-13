import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { Config } from "../config/env.js";

const createToken = (id) => {
  return jwt.sign({ id }, Config.JWT_SECRET, { expiresIn: "7d" });
};

async function sendTokenResponse(user, res, message) {
  const token = createToken(user._id);
  res.cookie("token", token);

  return res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
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
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (err) {
    console.log(err);
  }
};

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (err) {
    console.log(err);
  }
};

export const googleCallbackHandler = async (req, res) => {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    let isUserExist = await userModel.findOne({ email });

    if (!isUserExist) {
      isUserExist = await userModel.create({
        email: email,
        fullname: displayName,
        googleId: id,
      });
    }

    // Set cookie and redirect WITHOUT sending JSON
    const token = createToken(isUserExist._id);
    res.cookie("token", token);

    return res.redirect("http://localhost:5173");
  } catch (err) {
    console.log(err);
    return res.redirect("http://localhost:5173/login?error=oauth_failed");
  }
};
