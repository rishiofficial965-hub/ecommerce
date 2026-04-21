import { useSelector } from "react-redux";
import Loader from "../../auth/components/Loader.jsx";
import { Navigate } from "react-router-dom";

const Protected = ({ children, role }) => {
  const { loading, user } = useSelector((state) => state.auth);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
