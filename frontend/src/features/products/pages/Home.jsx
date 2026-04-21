import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import Nav from "../components/Nav";
import { FaShoppingCart, FaRegHeart, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PRODUCTS_PER_PAGE = 10;

const Home = () => {
  const { products } = useSelector((state) => state.product);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // Redirect sellers to their dashboard
  useEffect(() => {
    if (user?.role === "seller") {
      navigate("/seller/dashboard");
    }
  }, [user, navigate]);

  // Pagination Logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to product section top
    const section = document.getElementById("trending-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-albescent-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-copper-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-albescent-white flex flex-col font-sans">
      <Nav />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-lacquered-licorice">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-copper-green/20 skew-x-12 translate-x-1/4"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-playing-hooky/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-drop-bounce">
            <span className="inline-block px-4 py-1.5 bg-copper-green text-albescent-white text-xs font-bold tracking-[0.3em] uppercase rounded-full mb-6">
              New Collection 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-albescent-white tracking-tighter leading-none mb-8">
              UNAPOLOGETICALLY <br />
              <span className="text-playing-hooky">YOU.</span>
            </h1>
            <p className="text-albescent-white/60 text-lg max-w-md mb-10 font-medium leading-relaxed">
              Discover the latest in streetwear. Bold designs, premium fabrics,
              and a fit that speaks for itself. The Snitch drop is finally here.
            </p>
            <button className="group flex items-center gap-4 bg-albescent-white text-lacquered-licorice px-8 py-4 rounded-full font-black hover:bg-copper-green hover:text-albescent-white transition-all duration-500 transform hover:scale-105 shadow-2xl">
              SHOP THE DROP
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <div className="w-[450px] h-[550px] bg-desert-khaki/20 rounded-3xl border border-albescent-white/10 overflow-hidden relative group left-30">
              <div className="absolute inset-0 bg-gradient-to-t from-lacquered-licorice/60 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600"
                alt="Model"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute bottom-10 left-10 z-20">
                <p className="text-albescent-white font-black text-2xl tracking-tight leading-none mb-2">
                  Varsity Edit
                </p>
                <div className="w-12 h-1 bg-playing-hooky"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="trending-section" className="py-20 container mx-auto px-6 scroll-mt-20 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h2 className="text-4xl font-black text-lacquered-licorice tracking-tighter mb-4 italic uppercase">
              Trending <span className="text-copper-green">Now</span>
            </h2>
            <div className="w-20 h-2 bg-lacquered-licorice"></div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full border border-lacquered-licorice/10 font-bold hover:bg-lacquered-licorice hover:text-albescent-white transition-all">
              All
            </button>
            <button className="px-6 py-2 rounded-full border border-lacquered-licorice/10 font-bold hover:bg-lacquered-licorice hover:text-albescent-white transition-all">
              T-Shirts
            </button>
            <button className="px-6 py-2 rounded-full border border-lacquered-licorice/10 font-bold hover:bg-lacquered-licorice hover:text-albescent-white transition-all">
              Hoodies
            </button>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10"
        >
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/details/${product._id}`)}
                key={product._id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-desert-khaki/10 mb-4 group-hover:shadow-xl transition-all duration-500 border border-lacquered-licorice/5">
                  <img
                    src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay Icons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button className="w-8 h-8 bg-albescent-white rounded-full flex items-center justify-center text-lacquered-licorice hover:bg-copper-green hover:text-albescent-white transition-colors shadow-lg">
                      <FaRegHeart size={12} />
                    </button>
                    <button className="w-8 h-8 bg-albescent-white rounded-full flex items-center justify-center text-lacquered-licorice hover:bg-copper-green hover:text-albescent-white transition-colors shadow-lg">
                      <FaShoppingCart size={12} />
                    </button>
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <button className="w-full bg-lacquered-licorice text-albescent-white py-2 rounded-xl font-black text-[10px] tracking-widest hover:bg-copper-green transition-colors">
                      QUICK ADD
                    </button>
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-black text-sm text-lacquered-licorice tracking-tight line-clamp-1 flex-1 uppercase">
                      {product.title}
                    </h3>
                    <span className="font-black text-xs text-copper-green whitespace-nowrap">
                      {product.price.currency} {product.price.amount}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-lacquered-licorice/30 uppercase tracking-widest">
                    {product.category || "Lifestyle"}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex flex-col items-center gap-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-full border border-lacquered-licorice/10 flex items-center justify-center transition-all ${
                  currentPage === 1 
                    ? "opacity-20 cursor-not-allowed" 
                    : "hover:bg-lacquered-licorice hover:text-albescent-white shadow-md active:scale-90"
                }`}
              >
                <FaChevronLeft size={12} />
              </button>

              <div className="flex items-center gap-2.5 px-5 py-1.5 bg-desert-khaki/10 rounded-full border border-lacquered-licorice/5">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      currentPage === i + 1 
                        ? "bg-copper-green w-6" 
                        : "bg-lacquered-licorice/10 w-2 hover:bg-lacquered-licorice/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-full border border-lacquered-licorice/10 flex items-center justify-center transition-all ${
                  currentPage === totalPages 
                    ? "opacity-20 cursor-not-allowed" 
                    : "hover:bg-lacquered-licorice hover:text-albescent-white shadow-md active:scale-90"
                }`}
              >
                <FaChevronRight size={12} />
              </button>
            </div>
            
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lacquered-licorice/30">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-desert-khaki/20 border-y border-lacquered-licorice/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-lacquered-licorice tracking-tighter mb-6 uppercase">
            Join the <span className="text-copper-green">Club</span>
          </h2>
          <p className="text-lacquered-licorice/60 max-w-lg mx-auto mb-10 font-medium">
            Subscribe to receive updates, access to exclusive deals, and more.
            Be the first to know about new drops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-1 bg-white px-6 py-4 rounded-full border border-lacquered-licorice/10 focus:outline-none focus:ring-2 focus:ring-copper-green/20 font-bold"
            />
            <button className="bg-copper-green text-albescent-white px-8 py-4 rounded-full font-black tracking-widest hover:bg-lacquered-licorice transition-all shadow-lg active:scale-95">
              JOIN
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-lacquered-licorice text-albescent-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">
                Snitch
              </h3>
              <p className="text-albescent-white/40 text-sm font-medium leading-relaxed">
                Elevating streetwear since 2026. <br />
                We don't follow trends, <br />
                we set them.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-[0.2em] mb-8 text-sm text-playing-hooky">
                Shop
              </h4>
              <ul className="space-y-4 text-sm font-bold text-albescent-white/60">
                <li className="hover:text-albescent-white transition-colors cursor-pointer capitalize">
                  All Products
                </li>
                <li className="hover:text-albescent-white transition-colors cursor-pointer capitalize">
                  Best Sellers
                </li>
                <li className="hover:text-albescent-white transition-colors cursor-pointer capitalize">
                  New Arrivals
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-[0.2em] mb-8 text-sm text-playing-hooky">
                Support
              </h4>
              <ul className="space-y-4 text-sm font-bold text-albescent-white/60">
                <li className="hover:text-albescent-white transition-colors cursor-pointer capitalize">
                  Help Center
                </li>
                <li className="hover:text-albescent-white transition-colors cursor-pointer capitalize">
                  Shipping Policy
                </li>
                <li className="hover:text-albescent-white transition-colors cursor-pointer capitalize">
                  Returns & Refunds
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-[0.2em] mb-8 text-sm text-playing-hooky">
                Follow Us
              </h4>
              <div className="flex gap-6 text-2xl text-albescent-white/40">
                <i className="fa-brands fa-instagram hover:text-albescent-white cursor-pointer transition-colors"></i>
                <i className="fa-brands fa-twitter hover:text-albescent-white cursor-pointer transition-colors"></i>
                <i className="fa-brands fa-tiktok hover:text-albescent-white cursor-pointer transition-colors"></i>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-albescent-white/10 text-center">
            <p className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase">
              © 2026 SNITCH CLOTHING PVT LTD. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
