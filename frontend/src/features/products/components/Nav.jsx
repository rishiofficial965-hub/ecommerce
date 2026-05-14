import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth.js";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlus,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserPlus,
  FaSignInAlt,
  FaShoppingBag,
  FaSearch,
  FaTimes,
  FaBars,
  FaUser,
  FaListAlt,
  FaUserCircle,
  FaBox,
  FaArrowRight,
} from "react-icons/fa";

const ANNOUNCEMENTS = [
  "🚚  Free shipping on orders above ₹999",
  "🔥  New drop every Friday — Don't miss it",
  "✨  Use code SNITCH10 for 10% off your first order",
];

const Nav = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.product.products);
  const cartItemsCount = useSelector((state) => state.cart.cart?.totalItems || 0);
  const { handleLogout: logoutUser } = useAuth();

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounce: update debouncedQuery 1000ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Live search results (client-side from already-loaded products)
  const searchResults = debouncedQuery.trim().length >= 1
    ? products
        .filter((p) => {
          const q = debouncedQuery.toLowerCase();
          return (
            p.title?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  // Rotate announcements
  useEffect(() => {
    const t = setInterval(() => { 
      setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setMobileOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setSearchOpen(false);
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSelectProduct = (productId) => {
    setShowDropdown(false);
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/details/${productId}`);
  };

  const SearchDropdown = () => (
    <AnimatePresence>
      {showDropdown && searchQuery.trim().length >= 1 && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-lacquered-licorice/10 border border-lacquered-licorice/8 overflow-hidden z-50"
        >
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((product) => (
                <button
                  key={product._id}
                  onMouseDown={() => handleSelectProduct(product._id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-albescent-white/70 transition-colors text-left group border-b border-lacquered-licorice/5 last:border-none"
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-12 rounded-xl overflow-hidden bg-desert-khaki/20 shrink-0">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBox size={12} className="text-lacquered-licorice/20" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/30 mb-0.5">
                      {product.brand || product.category || "Snitch"}
                    </p>
                    <p className="text-xs font-black text-lacquered-licorice truncate uppercase group-hover:text-copper-green transition-colors">
                      {product.title}
                    </p>
                  </div>
                  {/* Price */}
                  <span className="text-xs font-black text-copper-green shrink-0">
                    {product.price.currency} {product.price.amount.toLocaleString()}
                  </span>
                  <FaArrowRight size={9} className="text-lacquered-licorice/20 group-hover:text-copper-green transition-colors shrink-0" />
                </button>
              ))}
              {/* See all results */}
              <button
                onMouseDown={handleSearchSubmit}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-lacquered-licorice/3 hover:bg-lacquered-licorice/6 text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/40 hover:text-copper-green transition-colors"
              >
                <FaSearch size={9} />
                See all results for "{searchQuery}"
              </button>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-lacquered-licorice/30">
                No products found
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-xl shadow-lacquered-licorice/10" : ""}`}>
      {/* ── Announcement Banner ──────────────────────────────────────────── */}
      <div className="bg-lacquered-licorice text-albescent-white text-center py-2 px-4 overflow-hidden relative">
        <div key={announcementIdx} className="text-[11px] font-bold tracking-[0.15em] uppercase animate-drop-bounce">
          {ANNOUNCEMENTS[announcementIdx]}
        </div>
      </div>

      {/* ── Main Nav ─────────────────────────────────────────────────────── */}
      <nav className="bg-albescent-white/95 backdrop-blur-md border-b border-lacquered-licorice/8 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 bg-copper-green rounded-xl flex items-center justify-center shadow-md group-hover:shadow-copper-green/30 transition-shadow">
              <span className="text-albescent-white font-black text-lg leading-none">S</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-lacquered-licorice group-hover:text-copper-green transition-colors hidden sm:block">
              SNITCH
            </span>
          </Link>

          {/* Search bar — desktop (buyers + unauthenticated) */}
          {user?.role !== "seller" && (
            <div className="hidden lg:block relative flex-1 max-w-sm mx-6" ref={searchRef}>
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-lacquered-licorice/5 border border-lacquered-licorice/10 rounded-full px-4 py-2 gap-2 focus-within:border-copper-green/40 focus-within:bg-white transition-all duration-300 group"
              >
                <FaSearch size={12} className="text-lacquered-licorice/30 group-focus-within:text-copper-green transition-colors shrink-0" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="flex-1 bg-transparent text-xs font-medium text-lacquered-licorice placeholder:text-lacquered-licorice/30 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
                    className="text-lacquered-licorice/30 hover:text-lacquered-licorice"
                  >
                    <FaTimes size={10} />
                  </button>
                )}
              </form>
              <SearchDropdown />
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Mobile search toggle (buyers only) */}
            {user?.role !== "seller" && (
              <button
                onClick={() => { setSearchOpen((v) => !v); setSearchQuery(""); setShowDropdown(false); }}
                className="lg:hidden p-2.5 rounded-xl text-lacquered-licorice/60 hover:bg-lacquered-licorice/5 transition-colors"
              >
                {searchOpen ? <FaTimes size={16} /> : <FaSearch size={16} />}
              </button>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-lacquered-licorice/60 hover:text-copper-green transition-colors px-3 py-2 rounded-xl hover:bg-lacquered-licorice/5"
                >
                  <FaSignInAlt size={13} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 bg-lacquered-licorice text-albescent-white px-4 py-2.5 rounded-xl hover:bg-copper-green transition-all duration-300 shadow-md text-[11px] font-black uppercase tracking-widest"
                >
                  <FaUserPlus size={12} />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            ) : user.role === "seller" ? (
              <>
                <Link
                  to="/seller/dashboard"
                  className="hidden md:flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-lacquered-licorice/60 hover:text-copper-green transition-colors px-3 py-2 rounded-xl hover:bg-lacquered-licorice/5"
                >
                  <FaTachometerAlt size={13} />
                  Dashboard
                </Link>
                <Link
                  to="/seller/create-product"
                  className="flex items-center gap-1.5 bg-copper-green text-albescent-white px-4 py-2.5 rounded-xl hover:bg-lacquered-licorice transition-all duration-300 shadow-md text-[11px] font-black uppercase tracking-widest"
                >
                  <FaPlus size={12} />
                  <span className="hidden sm:inline">New Product</span>
                </Link>
              </>
            ) : null}

            {/* Cart — buyers only */}
            {user?.role === "buyer" && (
              <>
                <Link
                  to="/orders"
                  className="hidden md:flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-lacquered-licorice/60 hover:text-copper-green transition-colors px-3 py-2 rounded-xl hover:bg-lacquered-licorice/5"
                >
                  <FaListAlt size={13} />
                  Orders
                </Link>
                <Link
                  to="/cart"
                  className="relative p-2.5 rounded-xl text-lacquered-licorice/70 hover:bg-lacquered-licorice hover:text-albescent-white transition-all duration-300 group"
                >
                  <FaShoppingBag size={18} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-copper-green text-albescent-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-albescent-white shadow-sm">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User info + logout */}
            {user && (
              <>
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-2 pl-2 border-l border-lacquered-licorice/10 ml-1 hover:opacity-75 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-xl bg-copper-green/10 border border-copper-green/20 flex items-center justify-center">
                    <FaUser size={11} className="text-copper-green" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/30 leading-none">
                      {user.role === "seller" ? "Seller" : "Account"}
                    </span>
                    <span className="text-xs font-black text-lacquered-licorice leading-none mt-0.5 max-w-[90px] truncate">
                      {user.fullname || "User"}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-xl text-lacquered-licorice/40 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                >
                  <FaSignOutAlt size={15} />
                </button>
              </>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-xl text-lacquered-licorice/60 hover:bg-lacquered-licorice/5 transition-colors"
            >
              {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar with live dropdown */}
        {searchOpen && (
          <div className="lg:hidden mt-3 border-t border-lacquered-licorice/8 pt-3 relative" ref={searchRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-lacquered-licorice/5 border border-lacquered-licorice/10 rounded-full px-4 py-2.5 focus-within:border-copper-green/40 focus-within:bg-white transition-all"
            >
              <FaSearch size={12} className="text-lacquered-licorice/30 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                className="flex-1 bg-transparent text-xs font-medium text-lacquered-licorice placeholder:text-lacquered-licorice/30 outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(""); setShowDropdown(false); }}>
                  <FaTimes size={10} className="text-lacquered-licorice/30" />
                </button>
              )}
            </form>
            <SearchDropdown />
          </div>
        )}

        {/* Mobile slide-down menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 border-t border-lacquered-licorice/8 pt-4 pb-2 flex flex-col gap-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-lacquered-licorice/70 hover:bg-lacquered-licorice/5">
                  <FaSignInAlt size={14} /> Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-lacquered-licorice text-albescent-white">
                  <FaUserPlus size={14} /> Sign Up
                </Link>
              </>
            ) : user.role === "seller" ? (
              <>
                <Link to="/seller/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-lacquered-licorice/70 hover:bg-lacquered-licorice/5">
                  <FaTachometerAlt size={14} /> Dashboard
                </Link>
                <Link to="/seller/create-product" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-copper-green text-albescent-white">
                  <FaPlus size={14} /> New Product
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-lacquered-licorice/70 hover:bg-lacquered-licorice/5">
                  <FaUserCircle size={14} /> My Profile
                </Link>
              </>
            ) : user.role === "buyer" ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-lacquered-licorice/70 hover:bg-lacquered-licorice/5">
                  <FaListAlt size={14} /> My Orders
                </Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-lacquered-licorice/70 hover:bg-lacquered-licorice/5">
                  <FaShoppingBag size={14} /> Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-lacquered-licorice/70 hover:bg-lacquered-licorice/5">
                  <FaUserCircle size={14} /> My Profile
                </Link>
              </>
            ) : null}
            {user && (
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 mt-1">
                <FaSignOutAlt size={14} /> Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Nav;
