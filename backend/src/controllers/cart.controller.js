import { stockOfVarient } from "../dao/product.dao.js";
import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, varientId } = req.params;
    const quantity = req.body.quantity || 1;

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
        return res
          .status(400)
          .json({ error: "Total quantity exceeds available stock", success: false });
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variant: varientId,
        quantity,
        price: selectedVariant.price,
        image: selectedVariant.images[0]?.url || product.images[0]?.url,
      });
    }

    await cart.save();
    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    const totalAmount = populatedCart.items.reduce(
      (total, item) => total + item.price.amount * item.quantity,
      0,
    );

    const totalItems = populatedCart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    res.status(201).json({
      success: true,
      cart: {
        ...populatedCart.toObject(),
        totalAmount,
        totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

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

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.price.amount * item.quantity,
      0,
    );

    const totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      cart: {
        ...cart.toObject(),
        totalAmount,
        totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId, varientId } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
        success: false,
      });
    }

    // Handle item removal if quantity is 0 or less
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
        return res.status(404).json({
          error: "Item not found in cart",
          success: false,
        });
      }

      // Check stock
      const product = await productModel.findById(productId);
      const variant = product.variants.id(varientId);

      if (!variant) {
        return res.status(404).json({
          error: "Product variant not found",
          success: false,
        });
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

    const totalAmount = populatedCart.items.reduce(
      (total, item) => total + item.price.amount * item.quantity,
      0,
    );

    const totalItems = populatedCart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      cart: {
        ...populatedCart.toObject(),
        totalAmount,
        totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, varientId } = req.params;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
        success: false,
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant.toString() === varientId
        ),
    );

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    const totalAmount = populatedCart.items.reduce(
      (total, item) => total + item.price.amount * item.quantity,
      0,
    );

    const totalItems = populatedCart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      cart: {
        ...populatedCart.toObject(),
        totalAmount,
        totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};
