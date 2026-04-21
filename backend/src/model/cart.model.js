import mongoose from "mongoose";
import priceSchema from "./price.schema.js";
const cartModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: priceSchema,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Cart", cartModel);
