import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import {
  validateAddToCart,
  validateUpdateCart,
  validateRemoveFromCart,
} from "../validator/cart.validator.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getCart);

router.post(
  "/add/:productId/:varientId",
  protect,
  validateAddToCart,
  addToCart,
);

// BUG FIX: added validateUpdateCart — previously had zero validation on the PATCH route
router.patch(
  "/update/:productId/:varientId",
  protect,
  validateUpdateCart,
  updateQuantity,
);

// BUG FIX: added validateRemoveFromCart to catch malformed IDs early
router.delete(
  "/remove/:productId/:varientId",
  protect,
  validateRemoveFromCart,
  removeFromCart,
);

export default router;
