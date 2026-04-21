import productModel from "../model/product.model.js";
import { uploadFile } from "../services/storage.service.js";

// Helper to upload files
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

export async function createProduct(req, res) {
  try {
    const { title, description, priceAmount, priceCurrency, variants: variantsRaw } = req.body;

    if (!title || !description || !priceAmount || !priceCurrency) {
      return res
        .status(400)
        .json({ success: false, message: "All basic fields are required" });
    }

    const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

    // Upload main images
    const images = await uploadImages(req, "images");

    // Upload variant images and process variants
    const processedVariants = await Promise.all(
      variants.map(async (variant, index) => {
        const variantImages = await uploadImages(req, `variant_${index}_images`);
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
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images,
      variants: processedVariants,
      Seller: req.user._id,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Product created successfully",
        product,
      });
  } catch (err) {
    console.error("CreateProduct error details:", {
      message: err.message,
      stack: err.stack,
      error: err,
    });
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to create product. Please try again.",
      });
  }
}


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

export async function getAllProducts(req, res) {
  try {
    const products = await productModel.find();
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GetAllProducts error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch products." });
  }
}

export async function getProductDetails(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("GetProductDetails error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch product." });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("DeleteProduct error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete product." });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priceAmount,
      priceCurrency,
      variants: variantsRaw,
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update only sent fields
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (priceAmount !== undefined) product.price.amount = priceAmount;
    if (priceCurrency !== undefined) product.price.currency = priceCurrency;

    const hasFiles = req.files && req.files.length > 0;

    // Handle main images
    const existingMainImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : product.images;
    const newMainImages = hasFiles ? await uploadImages(req, "images") : [];
    product.images = [...existingMainImages, ...newMainImages];

    // Handle variants
    if (variantsRaw !== undefined) {
      const variants = JSON.parse(variantsRaw);
      const processedVariants = await Promise.all(
        variants.map(async (variant, index) => {
          const variantImages = hasFiles
            ? await uploadImages(req, `variant_${index}_images`)
            : [];
          return {
            // Merge existing variant images with newly uploaded ones
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