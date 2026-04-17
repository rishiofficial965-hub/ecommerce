import { useSelector } from "react-redux";
import Loader from "../../auth/components/Loader.jsx";

const Protected = ({ children }) => {
  const loading = useSelector((state) => state.auth.loading);

  if (loading) return <Loader />;
  return <div>{children}</div>;
};

export default Protected;
