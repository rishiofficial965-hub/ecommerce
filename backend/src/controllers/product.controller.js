import productModel from "../model/product.model";

export async function createProduct(req, res) {
  const { title, description, price, images } = req.body;
  if (!title || !description || !price || !images) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const product = await productModel.create({
    title,
    description,
    price,
    images,
    Seller: req.user._id,
  });
  return res.status(201).json({ message: "Product created successfully" });
}
