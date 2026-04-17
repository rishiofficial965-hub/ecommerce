import { useEffect } from "react";
import { useProduct } from "../hooks/useProduct.js";
import { useSelector } from "react-redux";
import Nav from "../components/Nav.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { FaBoxOpen, FaChartLine, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const loading = useSelector((state) => state.product.loading);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const handleEdit = (product) => {
    console.log("Edit product", product);
    // Future implementation
  };

  const handleDelete = (productId) => {
    console.log("Delete product", productId);
    // Future implementation
  };

  return (
    <div className="min-h-screen bg-desert-khaki flex flex-col">
      <Nav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="animate-drop-bounce">
            <h1 className="text-4xl font-black text-lacquered-licorice tracking-tighter mb-2">
              Welcome back,{" "}
              <span className="text-copper-green">
                {user?.fullname?.split(" ")[0] || "Seller"}!
              </span>
            </h1>
            <p className="text-lacquered-licorice/60 font-medium">
              Here's what's happening with your store today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-lacquered-licorice/5 flex items-center gap-6 group hover:border-copper-green/20 transition-colors">
            <div className="w-16 h-16 bg-copper-green/10 rounded-2xl flex items-center justify-center text-copper-green group-hover:scale-110 transition-transform">
              <FaBoxOpen size={30} />
            </div>
            <div>
              <p className="text-sm font-bold text-lacquered-licorice/40 uppercase tracking-widest mb-1">
                Total Products
              </p>
              <h2 className="text-3xl font-black text-lacquered-licorice">
                {loading ? "..." : sellerProducts.length}
              </h2>
            </div>
          </div>

          {/* Placeholder Stats for Visual Balance */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-lacquered-licorice/5 flex items-center gap-6 opacity-60">
            <div className="w-16 h-16 bg-playing-hooky/10 rounded-2xl flex items-center justify-center text-playing-hooky">
              <FaChartLine size={30} />
            </div>
            <div>
              <p className="text-sm font-bold text-lacquered-licorice/40 uppercase tracking-widest mb-1">
                Total Sales
              </p>
              <h2 className="text-3xl font-black text-lacquered-licorice">0</h2>
            </div>
          </div>
          <div className="bg-copper-green p-6 rounded-3xl shadow-xl flex items-center gap-6 text-albescent-white">
            <div className="w-16 h-16 bg-albescent-white/20 rounded-2xl flex items-center justify-center">
              <div className="text-2xl font-black">₹</div>
            </div>
            <div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-1">
                Revenue
              </p>
              <h2 className="text-3xl font-black tracking-tighter">₹ 0.00</h2>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-lacquered-licorice tracking-tight">
            Your Listings
          </h2>
          <span className="text-sm font-bold bg-lacquered-licorice/10 px-4 py-1.5 rounded-full text-lacquered-licorice/60">
            {sellerProducts.length} Active
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-[400px] animate-pulse"
              >
                <div className="h-48 bg-lacquered-licorice/5 rounded-t-2xl"></div>
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-lacquered-licorice/5 rounded w-3/4"></div>
                  <div className="h-4 bg-lacquered-licorice/5 rounded w-full"></div>
                  <div className="h-4 bg-lacquered-licorice/5 rounded w-5/6"></div>
                  <div className="flex gap-4 pt-4">
                    <div className="h-10 bg-lacquered-licorice/5 rounded-xl flex-1"></div>
                    <div className="h-10 bg-lacquered-licorice/5 rounded-xl flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sellerProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-lacquered-licorice/10 rounded-3xl p-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-lacquered-licorice/5 rounded-full flex items-center justify-center text-lacquered-licorice/30 mb-6">
              <FaBoxOpen size={48} />
            </div>
            <h3 className="text-2xl font-black text-lacquered-licorice mb-2">
              No products yet
            </h3>
            <p className="text-lacquered-licorice/50 font-medium max-w-sm mb-8">
              Start your selling journey by adding your first product to the
              catalog.
            </p>
            <Link
              to="/seller/create-product"
              className="bg-copper-green text-albescent-white px-8 py-3 rounded-xl font-bold hover:bg-lacquered-licorice transition-all duration-300"
            >
              Add Product
            </Link>
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-lacquered-licorice/5 text-center">
        <p className="text-sm font-bold text-lacquered-licorice/30 uppercase tracking-[0.2em]">
          © 2026 SNITCH SELLER PLATFORM
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
