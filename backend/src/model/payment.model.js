import mongoose from "mongoose";
import priceSchema from "./price.schema.js";
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Cart",
      },
    ],
    price: { type: priceSchema, required: true },
    status: { type: String, enum: ["paid", "pending", "failed"], default: "pending" },
    payment_id: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    razorpay: {
      signature: { type: String },
      payment_id: { type: String },
      order_id: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const paymentModel = mongoose.model("payment", paymentSchema);

export default paymentModel;
