import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { Config } from "../config/env.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    Config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user._email,
      contact: user._contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const registerHandler = async (req, res) => {
  const { email, contact, password, fullname } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const user = await userModel.create({ email, contact, password, fullname });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (err) {
    console.log(err);
  }
};
