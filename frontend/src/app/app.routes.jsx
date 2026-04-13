import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../features/auth/pages/LoginForm.jsx";
import RegistrationForm from "../features/auth/pages/RegistrationForm.jsx";


export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>welcome to snitch</h1>,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element:<RegistrationForm/>,
  },
]);
