import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth.js";
import {
  FaPlus,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";

const Nav = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { handleLogout: logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-albescent-white/80 backdrop-blur-md border-b border-lacquered-licorice/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-copper-green rounded-xl flex items-center justify-center text-albescent-white font-black text-xl shadow-lg ">
            S
          </div>
          <span className="text-2xl font-black tracking-tighter text-lacquered-licorice group-hover:text-copper-green transition-colors">
            SNITCH
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {!user ? (
            /* Guest — show Login & Register */
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 text-lacquered-licorice/70 hover:text-copper-green font-medium transition-colors"
              >
                <FaSignInAlt size={18} />
                <span className="hidden md:inline">Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-copper-green text-albescent-white px-4 py-2 rounded-xl hover:bg-lacquered-licorice transition-all duration-300 shadow-md hover:shadow-xl group"
              >
                <FaUserPlus className="group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden md:inline font-bold">Sign Up</span>
              </Link>
            </>
          ) : user.role === "seller" ? (
            /* Seller — show Dashboard & Create Product */
            <>
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-2 text-lacquered-licorice/70 hover:text-copper-green font-medium transition-colors"
              >
                <FaTachometerAlt size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link
                to="/seller/create-product"
                className="flex items-center gap-2 bg-copper-green text-albescent-white px-4 py-2 rounded-xl hover:bg-lacquered-licorice transition-all duration-300 shadow-md hover:shadow-xl group"
              >
                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden md:inline font-bold">
                  Create Product
                </span>
              </Link>
            </>
          ) : null}

          {user && (
            <>
              <div className="h-8 w-[1px] bg-lacquered-licorice/10 mx-2"></div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-lacquered-licorice/40 uppercase tracking-widest leading-none mb-1">
                    {user.role === "seller" ? "Seller" : "Account"}
                  </span>
                  <span className="text-sm font-black text-lacquered-licorice leading-none">
                    {user.fullname || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-lacquered-licorice/5 text-lacquered-licorice/60 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
                  title="Logout"
                >
                  <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
