import { createProduct, getSellerProducts } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice.js";
import { setLoading } from "../../auth/state/auth.slice.js";

export const useProduct = () => {
  const dispatch = useDispatch();
  async function handleCreateProduct(formData) {
    try {
      dispatch(setLoading(true));
      const data = await createProduct(formData);
      return data.product;
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetSellerProducts() {
    try {
      dispatch(setLoading(true));
      const data = await getSellerProducts();
      dispatch(setSellerProducts(data.products));
      return data.products;
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts,
  };
};
