import { setError, setLoading, setUser } from "../state/auth.slice.js";

import { register } from "../services/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();
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
      const data = await register({ email, contact, password, fullname ,isSeller });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setLoading(false);
    }
  }

  return { handleRegister };
};
