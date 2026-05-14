import productModel from "../model/product.model.js";
import { uploadFile } from "../services/storage.service.js";

// ─── Helper: upload files by field name ───────────────────────────────────────
const uploadImages = async (req, fieldname) => {
  if (!req.files) return [];
  const files = req.files.filter((f) => f.fieldname === fieldname);
  return Promise.all(
    files.map(async (file) => {
      const uploadResult = await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
      return { url: uploadResult.url };
    }),
  );
};

// ─── Create Product ───────────────────────────────────────────────────────────
export async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      priceAmount,
      priceCurrency,
      category,
      brand,
      gender,
      stock,
      variants: variantsRaw,
    } = req.body;

    if (!title || !description || !priceAmount || !priceCurrency) {
      return res
        .status(400)
        .json({ success: false, message: "All basic fields are required" });
    }

    // BUG FIX: JSON.parse can throw — return 400 instead of letting 500 swallow it
    let variants = [];
    if (variantsRaw) {
      try {
        variants = JSON.parse(variantsRaw);
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid variants JSON" });
      }
    }

    const images = await uploadImages(req, "images");

    const processedVariants = await Promise.all(
      variants.map(async (variant, index) => {
        const variantImages = await uploadImages(
          req,
          `variant_${index}_images`,
        );
        return {
          images: variantImages,
          stock: variant.stock || 0,
          attributes: variant.attributes || {},
          price: {
            amount: variant.priceAmount,
            currency: variant.priceCurrency || priceCurrency,
          },
        };
      }),
    );

    const product = await productModel.create({
      title,
      description,
      price: { amount: priceAmount, currency: priceCurrency },
      images,
      category,
      brand,
      gender,
      stock,
      variants: processedVariants,
      Seller: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("CreateProduct error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create product. Please try again.",
    });
  }
}

// ─── Get Seller Products ──────────────────────────────────────────────────────
export async function getSellerProducts(req, res) {
  try {
    const products = await productModel.find({ Seller: req.user._id });
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GetSellerProducts error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch products." });
  }
}

// ─── Get All Products (with search & filters) ─────────────────────────────────
export async function getAllProducts(req, res) {
  try {
    const { q, category, gender } = req.query;

    const filter = {};

    // Full-text search across title, brand, category, description
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: regex },
        { brand: regex },
        { category: regex },
        { description: regex },
      ];
    }

    if (category && category !== "All") {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    if (gender && gender !== "All") {
      filter.gender = gender.trim();
    }

    const products = await productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate("Seller", "fullname email contact");

    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GetAllProducts error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch products." });
  }
}

// ─── Get Product Details ──────────────────────────────────────────────────────
export async function getProductDetails(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel
      .findById(id)
      .populate("Seller", "fullname email contact");

    // BUG FIX: return 404 instead of 200 with null product
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("GetProductDetails error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch product." });
  }
}

// ─── Delete Product ───────────────────────────────────────────────────────────
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // BUG FIX: only the seller who created it can delete it
    if (product.Seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised to delete this product" });
    }

    await product.deleteOne();
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("DeleteProduct error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete product." });
  }
}

// ─── Update Product ───────────────────────────────────────────────────────────
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priceAmount,
      priceCurrency,
      category,
      brand,
      gender,
      stock,
      variants: variantsRaw,
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // BUG FIX: only the owner can update the product
    if (product.Seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised to update this product" });
    }

    // Update only supplied fields
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (priceAmount !== undefined) product.price.amount = priceAmount;
    if (priceCurrency !== undefined) product.price.currency = priceCurrency;
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (gender !== undefined) product.gender = gender;
    if (stock !== undefined) product.stock = stock;

    const hasFiles = req.files && req.files.length > 0;

    // Merge existing main images with newly uploaded ones
    const existingMainImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : product.images;
    const newMainImages = hasFiles ? await uploadImages(req, "images") : [];
    product.images = [...existingMainImages, ...newMainImages];

    // Handle variants
    if (variantsRaw !== undefined) {
      let variants;
      try {
        variants = JSON.parse(variantsRaw);
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid variants JSON" });
      }

      const processedVariants = await Promise.all(
        variants.map(async (variant, index) => {
          const variantImages = hasFiles
            ? await uploadImages(req, `variant_${index}_images`)
            : [];
          return {
            images: [...(variant.images || []), ...variantImages],
            stock: variant.stock !== undefined ? variant.stock : 0,
            attributes: variant.attributes || {},
            price: {
              amount:
                variant.priceAmount || (variant.price && variant.price.amount),
              currency:
                variant.priceCurrency ||
                (variant.price && variant.price.currency) ||
                priceCurrency ||
                product.price.currency,
            },
          };
        }),
      );
      product.variants = processedVariants;
    }

    await product.save();
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("UpdateProduct error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update product." });
  }
}