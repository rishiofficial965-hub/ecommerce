import { RouterProvider } from "react-router-dom";
import { routes } from "./app.routes.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/hook/useAuth.js";
import Loader from "../features/auth/components/Loader.jsx";

const App = () => {
  const { handleGetMe } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    handleGetMe().finally(() => setInitializing(false));
  }, []);

  if (initializing) return <Loader />;
  return <RouterProvider router={routes} />;
};

export default App;
