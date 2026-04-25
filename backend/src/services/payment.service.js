import Razorpay from "razorpay";
import { Config } from "../config/env.js";

const razorpay = new Razorpay({
  key_id: Config.RAZORPAY_KEY_ID,
  key_secret: Config.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({amount,currency="INR"}) => {
  const order = await razorpay.orders.create({
    amount:amount*100,
    currency,
  });
  return order;
};