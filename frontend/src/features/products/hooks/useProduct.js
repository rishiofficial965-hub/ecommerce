import {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductDetails,
  deleteProductApi,
  updateProductApi,
} from "../services/product.api";
import { useDispatch } from "react-redux";
import {
  setSellerProducts,
  setProducts,
  setProductLoading,
} from "../state/product.slice.js";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    try {
      dispatch(setProductLoading(true));
      const data = await createProduct(formData);
      return data.product;
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  async function handleGetSellerProducts() {
    try {
      dispatch(setProductLoading(true));
      const data = await getSellerProducts();
      dispatch(setSellerProducts(data.products));
      return data.products;
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  async function handleGetAllProducts() {
    try {
      dispatch(setProductLoading(true));
      const data = await getAllProducts();
      dispatch(setProducts(data.products));
      return data.products;
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  async function handleGetProductDetails(id) {
    try {
      dispatch(setProductLoading(true));
      const data = await getProductDetails(id);
      return data.product;
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  async function handleDeleteProduct(id) {
    try {
      dispatch(setProductLoading(true));
      const data = await deleteProductApi(id);
      return { success: true, data };
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  async function handleUpdateProduct(id, data) {
    try {
      dispatch(setProductLoading(true));
      const res = await updateProductApi(id, data);
      return { success: true, data: res };
    } catch (error) {
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleGetProductDetails,
    handleDeleteProduct,
    handleUpdateProduct,
  };
};
