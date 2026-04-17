import productModel from "../model/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;

    if (!title || !description || !priceAmount || !priceCurrency) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
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
      Seller: req.user._id,
    });

    return res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (err) {
    console.error("CreateProduct error:", err);
    return res.status(500).json({ success: false, message: "Failed to create product. Please try again." });
  }
}

export async function getSellerProducts(req, res) {
  try {
    const products = await productModel.find({ Seller: req.user._id });
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GetSellerProducts error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch products." });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await productModel.find();
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GetAllProducts error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch products." });
  }
}
