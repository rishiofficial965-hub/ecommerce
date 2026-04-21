import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export async function fetchCart() {
  const response = await cartApiInstance.get("/");
  return response.data;
}

export async function addProductToCart({ productId, varientId, quantity }) {
  const response = await cartApiInstance.post(`/add/${productId}/${varientId}`, {
    quantity,
  });
  return response.data;
}

export async function updateItemQuantity({ productId, varientId, quantity }) {
  const response = await cartApiInstance.patch(
    `/update/${productId}/${varientId}`,
    { quantity }
  );
  return response.data;
}

export async function removeItemFromCart({ productId, varientId }) {
  const response = await cartApiInstance.delete(
    `/remove/${productId}/${varientId}`
  );
  return response.data;
}
