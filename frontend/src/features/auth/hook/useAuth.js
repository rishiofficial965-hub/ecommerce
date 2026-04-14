import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setError, setLoading, setUser, setPendingUserId } from "../state/auth.slice.js";
import { register, login, verifyOTP, resendOTP } from "../services/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const pendingUserId = useSelector((state) => state.auth.pendingUserId);

  async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await register({ email, contact, password, fullname, isSeller });

      // Store the userId in Redux so VerifyOTPPage can use it
      dispatch(setPendingUserId(data.userId));

      // Redirect to OTP verification page
      navigate("/verify-otp");

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 
                  error.response?.data?.error || 
                  error.message || 
                  "An unexpected error occurred";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 
                  error.response?.data?.error || 
                  error.message || 
                  "An unexpected error occurred";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleVerifyOTP({ userId, otp }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await verifyOTP({ userId, otp });
      // Backend now issues JWT on successful verification — log user in
      dispatch(setUser(data.user));
      navigate("/");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 
                  error.response?.data?.error || 
                  error.message || 
                  "An unexpected error occurred";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResendOTP({ userId }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await resendOTP({ userId });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleVerifyOTP, handleResendOTP, loading, pendingUserId };
};
