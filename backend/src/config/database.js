import mongoose from "mongoose";
import { Config } from "./env.js";

export default async () => {
  try {
    if (!Config.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined");
    }
    await mongoose.connect(Config.MONGODB_URL);

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("error while connecting to db", err);
  }
};
