import Razorpay from "razorpay";
import { Config } from "../config/env.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: Config.RAZORPAY_KEY_ID,
  key_secret: Config.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({ amount, currency = "INR" }) => {
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency,
  });
  return order;
};

export const verifySignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac("sha256", Config.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};