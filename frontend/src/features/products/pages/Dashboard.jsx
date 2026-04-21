import { useEffect } from "react";
import { useProduct } from "../hooks/useProduct.js";
import { useSelector } from "react-redux";
import Nav from "../components/Nav.jsx";
import ProductCard from "../components/ProductCard.jsx";
import {
  FaBoxOpen, FaChartLine, FaRupeeSign, FaPlus, FaArrowRight,
  FaFire, FaLayerGroup, FaExclamationTriangle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { handleGetSellerProducts, handleDeleteProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const loading = useSelector((state) => state.product.loading);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleDelete = async (productId) => {
    const res = await handleDeleteProduct(productId);
    if (res.success) handleGetSellerProducts();
  };

  useEffect(() => { handleGetSellerProducts(); }, []);

  // Derived stats
  const totalVariants = sellerProducts.reduce((s, p) => s + (p.variants?.length || 0), 0);
  const outOfStock = sellerProducts.filter(
    (p) => p.variants?.every((v) => v.stock === 0) || (!p.variants?.length && p.stock === 0)
  ).length;
  const lowStock = sellerProducts.filter(
    (p) => p.variants?.some((v) => v.stock > 0 && v.stock <= 5)
  ).length;

  const stats = [
    {
      icon: <FaBoxOpen size={20} />,
      label: "Total Products",
      value: loading ? "—" : sellerProducts.length,
      sub: "active listings",
      color: "bg-copper-green/10 text-copper-green",
      accent: "border-copper-green/20",
    },
    {
      icon: <FaLayerGroup size={20} />,
      label: "Total Variants",
      value: loading ? "—" : totalVariants,
      sub: "across all products",
      color: "bg-playing-hooky/10 text-playing-hooky",
      accent: "border-playing-hooky/20",
    },
    {
      icon: <FaExclamationTriangle size={20} />,
      label: "Low Stock",
      value: loading ? "—" : lowStock,
      sub: "variants need attention",
      color: "bg-orange-100 text-orange-500",
      accent: "border-orange-200",
      alert: lowStock > 0,
    },
    {
      icon: <FaRupeeSign size={20} />,
      label: "Revenue",
      value: "₹ 0",
      sub: "coming soon",
      color: "bg-lacquered-licorice/5 text-lacquered-licorice/30",
      accent: "border-lacquered-licorice/8",
      muted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-albescent-white flex flex-col font-sans">
      <Nav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10">

        {/* ── Welcome Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-copper-green mb-2">
              Seller Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-lacquered-licorice tracking-tighter leading-none">
              Hey,{" "}
              <span className="text-copper-green italic">
                {user?.fullname?.split(" ")[0] || "Seller"}
              </span>{" "}
              👋
            </h1>
            <p className="text-lacquered-licorice/40 font-medium text-sm mt-2">
              Here's what's happening with your store today.
            </p>
          </div>

          <Link
            to="/seller/create-product"
            className="group flex items-center gap-2.5 bg-lacquered-licorice text-albescent-white px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-copper-green transition-all duration-500 shadow-lg active:scale-95 shrink-0"
          >
            <FaPlus size={12} className="group-hover:rotate-90 transition-transform duration-300" />
            New Product
          </Link>
        </div>

        {/* ── Stats Grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`bg-white rounded-3xl p-6 border ${s.accent} shadow-sm flex flex-col gap-4 ${s.muted ? "opacity-50" : ""}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/30 mb-1">
                  {s.label}
                </p>
                <p className={`text-3xl font-black tracking-tighter ${s.alert ? "text-orange-500" : "text-lacquered-licorice"}`}>
                  {s.value}
                </p>
                <p className="text-[10px] font-medium text-lacquered-licorice/25 mt-0.5">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Out of stock alert ────────────────────────────────────────── */}
        {outOfStock > 0 && (
          <div className="mb-8 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-center gap-3">
            <FaFire className="text-red-400 shrink-0" size={16} />
            <p className="text-xs font-bold text-red-500 flex-1">
              {outOfStock} product{outOfStock > 1 ? "s are" : " is"} out of stock — update your inventory to keep selling.
            </p>
            <button onClick={() => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" })}
              className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1 shrink-0">
              View <FaArrowRight size={9} />
            </button>
          </div>
        )}

        {/* ── Listings Header ───────────────────────────────────────────── */}
        <div id="listings" className="flex items-center justify-between gap-4 mb-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-lacquered-licorice tracking-tighter uppercase italic">
              Your Listings
            </h2>
            {!loading && sellerProducts.length > 0 && (
              <span className="bg-lacquered-licorice text-albescent-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                {sellerProducts.length} Active
              </span>
            )}
          </div>
          <div className="flex-1 h-px bg-lacquered-licorice/8 hidden sm:block" />
        </div>

        {/* ── Product Grid ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-lacquered-licorice/5 animate-pulse">
                <div className="aspect-[4/3] bg-lacquered-licorice/5" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-lacquered-licorice/5 rounded-full w-1/2" />
                  <div className="h-5 bg-lacquered-licorice/5 rounded-full w-3/4" />
                  <div className="h-3 bg-lacquered-licorice/5 rounded-full w-full" />
                  <div className="h-3 bg-lacquered-licorice/5 rounded-full w-5/6" />
                  <div className="flex gap-3 pt-2">
                    <div className="h-9 bg-lacquered-licorice/5 rounded-xl flex-1" />
                    <div className="h-9 bg-lacquered-licorice/5 rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sellerProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sellerProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard
                  product={product}
                  onEdit={(id) => navigate(`/seller/product/${id}`)}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-lacquered-licorice/8 rounded-[2.5rem] p-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-lacquered-licorice/5 rounded-full flex items-center justify-center text-lacquered-licorice/20 mb-6">
              <FaBoxOpen size={44} />
            </div>
            <h3 className="text-2xl font-black text-lacquered-licorice mb-2 uppercase tracking-tighter italic">
              No products yet
            </h3>
            <p className="text-lacquered-licorice/40 font-medium max-w-sm mb-8 text-sm leading-relaxed">
              Start your selling journey by adding your first product to the catalog.
            </p>
            <Link to="/seller/create-product"
              className="group flex items-center gap-2.5 bg-copper-green text-albescent-white px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-lacquered-licorice transition-all duration-500 shadow-xl active:scale-95">
              <FaPlus size={12} className="group-hover:rotate-90 transition-transform duration-300" />
              Add First Product
            </Link>
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-10 border-t border-lacquered-licorice/5 text-center mt-8">
        <p className="text-[9px] font-black tracking-[0.4em] text-lacquered-licorice/20 uppercase">
          © 2026 Snitch Seller Platform · All rights reserved
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
