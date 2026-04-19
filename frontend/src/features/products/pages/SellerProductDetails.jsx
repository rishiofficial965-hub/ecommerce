import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../auth/components/Loader";

const SellerProductDetails = () => {
  const { productId } = useParams();
  const loading = useSelector((state) => state.product.loading);
  const { handleGetProductDetails } = useProduct();
  async function getProductDetails() {
    const res = await handleGetProductDetails(productId);
    setProduct(res);
  }

  useEffect(() => {
    getProductDetails();
  }, [productId]);

  if (loading && !product) return <Loader />;
  return <div>SellerProductDetails</div>;
};

export default SellerProductDetails;
