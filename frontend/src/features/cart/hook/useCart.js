import { useDispatch, useSelector } from "react-redux";
import { setCart, setLoading, setError } from "../state/cart.slice";
import {
  fetchCart,
  addProductToCart,
  updateItemQuantity,
  removeItemFromCart,
} from "../services/cart.api";

export const useCart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);

  const handleGetCart = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await fetchCart();
      dispatch(setCart(data.cart));
      return { success: true, cart: data.cart };
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      dispatch(setCart(null));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddToCart = async ({ productId, varientId, quantity }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await addProductToCart({ productId, varientId, quantity });
      dispatch(setCart(data.cart));
      return { success: true, cart: data.cart };
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateQuantity = async ({ productId, varientId, quantity }) => {
    try {
      dispatch(setError(null));
      const data = await updateItemQuantity({ productId, varientId, quantity });
      dispatch(setCart(data.cart));
      return { success: true, cart: data.cart };
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    }
  };

  const handleRemoveFromCart = async ({ productId, varientId }) => {
    try {
      dispatch(setError(null));
      const data = await removeItemFromCart({ productId, varientId });
      dispatch(setCart(data.cart));
      return { success: true, cart: data.cart };
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    }
  };

  return {
    cart,
    loading,
    error,
    handleGetCart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
  };
};
