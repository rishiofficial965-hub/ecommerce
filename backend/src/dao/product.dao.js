import productModel from "../model/product.model.js";

export const stockOfVarient = async (productId, varientId) => {
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": varientId,
  });
  if (!product) {
    return null;
  }
  return product.variants.find(
    (variant) => variant._id.toString() === varientId,
  );
};
