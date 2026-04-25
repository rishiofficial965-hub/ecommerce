import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { createOrder, verifySignature } from "../services/payment.service.js";
import paymentModel from "../model/payment.model.js";
// ─── Shared helper ────────────────────────────────────────────────────────────
/**
 * Build the summary fields (totalAmount, totalItems) from a populated cart
 * and return the enriched cart object safe for the response.
 */
function buildCartResponse(populatedCart) {
  // Map items to include their LIVE price from the product variants
  const itemsWithLivePrice = populatedCart.items.map((item) => {
    const cartItem = item.toObject ? item.toObject() : item;

    // If product is not populated, fallback to stored snapshot
    if (!item.product) return cartItem;

    // 1. Try to find the specific variant price
    const currentVariant = item.product.variants?.find(
      (v) => v._id.toString() === item.variant?.toString(),
    );

    // 2. Determine the live price: Variant Price > Base Product Price > Stored Snapshot
    const livePrice =
      currentVariant?.price || item.product.price || cartItem.price;

    return {
      ...cartItem,
      price: livePrice,
    };
  });

  const totalAmount = itemsWithLivePrice.reduce(
    (total, item) => total + item.price.amount * item.quantity,
    0,
  );
  const totalItems = itemsWithLivePrice.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  return {
    ...populatedCart.toObject(),
    items: itemsWithLivePrice,
    totalAmount,
    totalItems,
  };
}

// ─── Add to Cart ──────────────────────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const { productId, varientId } = req.params;
    const quantity = Number(req.body.quantity) || 1;

    // Fetch product + confirm the variant belongs to it
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": varientId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product or variant not found", success: false });
    }

    const selectedVariant = product.variants.find(
      (v) => v._id.toString() === varientId,
    );

    // Should never be falsy after the query above, but guard anyway
    if (!selectedVariant) {
      return res
        .status(404)
        .json({ error: "Variant not found", success: false });
    }

    if (selectedVariant.stock < quantity) {
      return res
        .status(400)
        .json({ error: "Insufficient stock", success: false });
    }

    // Upsert cart
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      cart = await cartModel.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === varientId,
    );

    if (existingItem) {
      if (selectedVariant.stock < existingItem.quantity + quantity) {
        return res.status(400).json({
          error: "Total quantity exceeds available stock",
          success: false,
        });
      }
      existingItem.quantity += quantity;
    } else {
      // BUG FIX: fallback to "" to satisfy the `required: true` image field in cart model
      const image =
        selectedVariant.images?.[0]?.url || product.images?.[0]?.url || "";

      cart.items.push({
        product: productId,
        variant: varientId,
        quantity,
        price: selectedVariant.price,
        image,
      });
    }

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    return res.status(201).json({
      success: true,
      cart: buildCartResponse(populatedCart),
    });
  } catch (error) {
    console.error("AddToCart error:", error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

// ─── Get Cart ─────────────────────────────────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalAmount: 0, totalItems: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      cart: buildCartResponse(cart),
    });
  } catch (error) {
    console.error("GetCart error:", error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

// ─── Update Quantity ──────────────────────────────────────────────────────────
export const updateQuantity = async (req, res) => {
  try {
    const { productId, varientId } = req.params;
    const quantity = Number(req.body.quantity);

    if (isNaN(quantity)) {
      return res
        .status(400)
        .json({ error: "quantity must be a number", success: false });
    }

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found", success: false });
    }

    // quantity ≤ 0 → treat as remove
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          !(
            item.product.toString() === productId &&
            item.variant.toString() === varientId
          ),
      );
    } else {
      const item = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.variant.toString() === varientId,
      );

      if (!item) {
        return res
          .status(404)
          .json({ error: "Item not found in cart", success: false });
      }

      // BUG FIX: productModel.findById can return null — guard before accessing .variants
      const product = await productModel.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ error: "Product not found", success: false });
      }

      const variant = product.variants.id(varientId);
      if (!variant) {
        return res
          .status(404)
          .json({ error: "Product variant not found", success: false });
      }

      if (variant.stock < quantity) {
        return res.status(400).json({
          error: `Insufficient stock. Only ${variant.stock} units available.`,
          success: false,
        });
      }

      item.quantity = quantity;
    }

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    return res.status(200).json({
      success: true,
      cart: buildCartResponse(populatedCart),
    });
  } catch (error) {
    console.error("UpdateQuantity error:", error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

// ─── Remove From Cart ─────────────────────────────────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    const { productId, varientId } = req.params;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found", success: false });
    }

    const prevLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant.toString() === varientId
        ),
    );

    // BUG FIX: if nothing was removed, the item was not in the cart
    if (cart.items.length === prevLength) {
      return res
        .status(404)
        .json({ error: "Item not found in cart", success: false });
    }

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    return res.status(200).json({
      success: true,
      cart: buildCartResponse(populatedCart),
    });
  } catch (error) {
    console.error("RemoveFromCart error:", error);
    return res.status(500).json({ error: error.message, success: false });
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const user = req.user;

    // 1. Get user's cart to save as items
    const cart = await cartModel.findOne({ user: user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Create Razorpay Order
    const order = await createOrder({ amount, currency });

    // 3. Create/Update pending payment record (Idempotency)
    // We use findOneAndUpdate to ensure we don't create multiple pending payments for the same order if user retries
    await paymentModel.findOneAndUpdate(
      { "razorpay.order_id": order.id },
      {
        user: user._id,
        orderItems: cart.items.map((item) => item._id), // or item.product if you prefer ref
        price: { amount, currency },
        status: "pending",
        email: user.email,
        phone: user.contact,
        razorpay: { order_id: order.id },
      },
      { upsert: true, new: true },
    );

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("CreatePaymentOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    // 1. Verify Signature
    const isAuthentic = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isAuthentic) {
      // Mark payment as failed if we find the record
      await paymentModel.findOneAndUpdate(
        { "razorpay.order_id": razorpay_order_id },
        { status: "failed" },
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // 2. Update Payment Record
    const payment = await paymentModel.findOneAndUpdate(
      { "razorpay.order_id": razorpay_order_id },
      {
        status: "paid",
        "razorpay.payment_id": razorpay_payment_id,
        "razorpay.signature": razorpay_signature,
        payment_id: razorpay_payment_id,
      },
      { new: true },
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }

    // 3. Clear the User's Cart
    await cartModel.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return res.status(200).json({
      success: true,
      message: "Payment verified and cart cleared",
      payment,
    });
  } catch (error) {
    console.error("VerifyPayment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
