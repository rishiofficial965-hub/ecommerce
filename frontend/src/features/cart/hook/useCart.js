import { useDispatch, useSelector } from "react-redux";
import { setCart, setLoading, setError } from "../state/cart.slice";
import {
  fetchCart,
  addProductToCart,
  updateItemQuantity,
  removeItemFromCart,
  createOrderApi,
  verifyPaymentApi,
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
      // BUG FIX: was silently swallowing the error — now surfaces it via Redux
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      dispatch(setCart(null));
      dispatch(setError(msg));
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
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await updateItemQuantity({ productId, varientId, quantity });
      dispatch(setCart(data.cart));
      return { success: true, cart: data.cart };
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRemoveFromCart = async ({ productId, varientId }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await removeItemFromCart({ productId, varientId });
      dispatch(setCart(data.cart));
      return { success: true, cart: data.cart };
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateOrder = async () => {
    try {
      const data = await createOrderApi(cart.totalAmount, "INR");
      return { success: true, order: data.order };
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      return { success: false, error: msg };
    }
  };

  const handleVerifyPayment = async (paymentData) => {
    try {
      dispatch(setLoading(true));
      const data = await verifyPaymentApi(paymentData);
      // Refresh cart after payment (it should be empty now)
      handleGetCart();
      return { success: true, data };
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
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
    handleCreateOrder,
    handleVerifyPayment,
  };
};
