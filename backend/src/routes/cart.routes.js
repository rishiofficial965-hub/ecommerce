import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protect, getCart);

router.post(
  "/add/:productId/:varientId",
  protect,
  validateAddToCart,
  addToCart,
);

router.patch(
  "/update/:productId/:varientId",
  protect,
  updateQuantity,
);

router.delete(
  "/remove/:productId/:varientId",
  protect,
  removeFromCart,
);

export default router;
