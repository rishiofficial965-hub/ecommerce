import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../features/auth/pages/LoginForm.jsx";
import RegistrationForm from "../features/auth/pages/RegistrationForm.jsx";
import VerifyOTPPage from "../features/auth/pages/VerifyOTPPage.jsx";
import ForgetPassword from "../features/auth/pages/ForgetPassword.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import Protected from "../features/products/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTPPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "create-product",
        element: (
          <Protected>
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
    ],
  },
]);
