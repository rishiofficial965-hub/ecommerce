import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUser } from "../state/auth.slice.js";
import { register, login } from "../services/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await register({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });
      dispatch(setUser(data.user));
      return { success: true };
    } catch (error) {
      dispatch(setError(error.message));
      return { success: false, error: error.response?.data?.message || error.message };
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
      dispatch(setError(error.message));
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, loading };
};
