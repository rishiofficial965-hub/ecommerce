import { RouterProvider } from "react-router-dom";
import { routes } from "./app.routes.jsx";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hook/useAuth.js";
import { useCart } from "../features/cart/hook/useCart";
import Loader from "../features/auth/components/Loader.jsx";

const App = () => {
  const { handleGetCart } = useCart();
  const { handleGetMe } = useAuth();
  const [initializing, setInitializing] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    handleGetMe().finally(() => {
      setInitializing(false);
    });
  }, []);

  useEffect(() => {
    if (user && user.role === "buyer") {
      handleGetCart();
    }
  }, [user]);

  if (initializing) return <Loader />;
  return <RouterProvider router={routes} />;
};

export default App;
