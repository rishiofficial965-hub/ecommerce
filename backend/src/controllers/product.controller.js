import productModel from "../model/product.model.js ";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body;

  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  if (!title || !description || !priceAmount || !priceCurrency) {
    return res.status(400).json({ message: "All fields are required" });
  }

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

  return res.status(201).json({ message: "Product created successfully" });
}

export async function getSellerProducts(req, res) {
  const products = await productModel.find({ Seller: req.user._id });
  return res.status(200).json({ products });
}
