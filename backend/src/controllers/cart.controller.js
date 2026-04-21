import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";

// ─── Shared helper ────────────────────────────────────────────────────────────
/**
 * Build the summary fields (totalAmount, totalItems) from a populated cart
 * and return the enriched cart object safe for the response.
 */
function buildCartResponse(populatedCart) {
  const totalAmount = populatedCart.items.reduce(
    (total, item) => total + item.price.amount * item.quantity,
    0,
  );
  const totalItems = populatedCart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  return { ...populatedCart.toObject(), totalAmount, totalItems };
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
        selectedVariant.images?.[0]?.url ||
        product.images?.[0]?.url ||
        "";

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
      return res
        .status(404)
        .json({ error: "Cart not found", success: false });
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
      return res
        .status(404)
        .json({ error: "Cart not found", success: false });
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
