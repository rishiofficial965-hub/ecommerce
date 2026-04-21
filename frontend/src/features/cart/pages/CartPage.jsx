import { useCart } from "../hook/useCart";
import Nav from "../../products/components/Nav";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShieldAlt, FaTruck, FaTag, FaCheck, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../auth/components/Loader";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIPPING_THRESHOLD = 999;

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, handleGetCart, handleUpdateQuantity, handleRemoveFromCart } = useCart();
  const { user } = useSelector((state) => state.auth);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    if (user) {
      handleGetCart();
    }
  }, [user]);

  if (loading) return <Loader />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-albescent-white flex flex-col font-sans">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-desert-khaki/10 rounded-full flex items-center justify-center mb-8">
            <svg className="w-10 h-10 text-lacquered-licorice/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-lacquered-licorice mb-4 tracking-tighter uppercase italic">
            Your Bag is Empty
          </h1>
          <p className="text-lacquered-licorice/50 mb-10 text-sm font-medium leading-relaxed">
            Discover our latest drops and find something that suits your style. 
            The street is waiting for you.
          </p>
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 bg-lacquered-licorice text-albescent-white px-10 py-4 rounded-full font-black tracking-widest text-[10px] hover:bg-copper-green transition-all duration-500 shadow-2xl hover:shadow-copper-green/20"
          >
            DISCOVER NOW
            <FaArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-albescent-white font-sans text-lacquered-licorice">
      <Nav />
      <main className="container mx-auto max-w-6xl px-6 py-16">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-lacquered-licorice/40 hover:text-copper-green transition-colors mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            Shopping <span className="text-copper-green">Bag</span>
          </h1>
          <div className="h-px flex-1 bg-lacquered-licorice/10 ml-4"></div>
          <span className="text-xs font-black bg-lacquered-licorice text-albescent-white px-4 py-1.5 rounded-full tracking-widest leading-none">
            {cart.totalItems || 0} ITEMS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AnimatePresence mode="popLayout">
              {cart.items.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={`${item.product._id}-${item.variant}`}
                  className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 p-6 bg-white rounded-[2.5rem] border border-lacquered-licorice/5 hover:shadow-2xl hover:shadow-lacquered-licorice/5 transition-all duration-500"
                >
                  {/* Image Column */}
                  <div className="md:col-span-3 aspect-[3/4] bg-desert-khaki/10 rounded-3xl overflow-hidden border border-lacquered-licorice/5">
                    <img
                      src={item.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>

                  {/* Content Column */}
                  <div className="md:col-span-9 flex flex-col justify-between py-2">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-copper-green mb-2 leading-none">
                            {item.product.brand || "Snitch Originals"}
                          </p>
                          <h3 className="text-2xl font-black tracking-tighter uppercase leading-none group-hover:text-copper-green transition-colors duration-300">
                            {item.product.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart({ productId: item.product._id, varientId: item.variant })}
                          className="w-10 h-10 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform active:scale-90"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.product.brand && (
                          <span className="px-3 py-1 bg-lacquered-licorice/5 rounded-full text-[9px] font-black uppercase tracking-widest border border-lacquered-licorice/5">
                            {item.product.brand}
                          </span>
                        )}
                        {item.product.category && (
                          <span className="px-3 py-1 bg-lacquered-licorice/5 rounded-full text-[9px] font-black uppercase tracking-widest border border-lacquered-licorice/5">
                            {item.product.category}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-copper-green/5 text-copper-green rounded-full text-[9px] font-black uppercase tracking-widest border border-copper-green/10">
                          In Stock
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 mt-auto border-t border-lacquered-licorice/5">
                      <div className="flex flex-col gap-3">
                         <p className="text-[9px] font-black text-lacquered-licorice/30 uppercase tracking-[0.2em] mb-1">
                          Select Quantity
                        </p>
                        <div className="flex items-center gap-6 bg-albescent-white rounded-2xl p-1.5 border border-lacquered-licorice/5 w-fit shadow-inner">
                          <button
                            disabled={loading}
                            onClick={() => item.quantity > 0 && handleUpdateQuantity({ productId: item.product._id, varientId: item.variant, quantity: item.quantity - 1 })}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-md text-lacquered-licorice/40 hover:text-lacquered-licorice transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="text-sm font-black min-w-[1.5rem] text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            disabled={loading}
                            onClick={() => handleUpdateQuantity({ productId: item.product._id, varientId: item.variant, quantity: item.quantity + 1 })}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:shadow-md text-lacquered-licorice/40 hover:text-lacquered-licorice transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-black text-lacquered-licorice/30 uppercase tracking-[0.2em] mb-1">
                          Item Subtotal
                        </p>
                        <p className="text-3xl font-black tracking-tighter tabular-nums">
                          {item.price.currency} {(item.price.amount * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-lacquered-licorice text-albescent-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              {/* Decorative Circle */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-copper-green/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

              <h2 className="text-2xl font-black uppercase tracking-tighter italic border-b border-white/10 pb-8 mb-8 relative z-10">
                Order <span className="text-playing-hooky">Details</span>
              </h2>
              
              <div className="space-y-6 mb-12 relative z-10">
                <div className="flex justify-between items-center group/row">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover/row:opacity-100 transition-opacity">Bag Total</span>
                  <span className="text-sm font-bold tabular-nums">INR {(cart.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center group/row">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover/row:opacity-100 transition-opacity">Shipping</span>
                  <span className="text-xs font-black text-copper-green tracking-widest italic">FREE</span>
                </div>
                <div className="flex justify-between items-center group/row">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover/row:opacity-100 transition-opacity">Insurance</span>
                  <span className="text-[10px] font-black opacity-40 italic">COMPLIMENTARY</span>
                </div>
                
                <div className="h-px bg-white/10 my-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-playing-hooky">Total Amount</span>
                  <div className="text-right">
                    <span className="text-4xl font-black tracking-tighter block leading-none mb-1 tabular-nums">INR {(cart.totalAmount || 0).toLocaleString()}</span>
                    <span className="text-[9px] font-medium opacity-30 uppercase tracking-widest italic">inclusive of all taxes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <button className="w-full bg-copper-green text-albescent-white py-5 rounded-2xl font-black tracking-[0.2em] text-[11px] hover:bg-albescent-white hover:text-lacquered-licorice transition-all duration-700 shadow-lg hover:shadow-copper-green/20 active:scale-95 flex items-center justify-center gap-3 uppercase group/btn">
                  SECURE CHECKOUT
                  <FaArrowLeft className="rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center justify-center gap-6 pt-4 text-white/20">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt size={12} />
                    <span className="text-[8px] font-black uppercase">Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTruck size={12} />
                    <span className="text-[8px] font-black uppercase">Tracked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-6 border border-lacquered-licorice/8 rounded-3xl overflow-hidden">
              <button
                onClick={() => setPromoOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-lacquered-licorice/3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaTag size={12} className="text-copper-green" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">{promoApplied ? "Promo Applied 🎉" : "Apply Promo Code"}</p>
                    {promoApplied && <p className="text-[9px] text-copper-green font-bold mt-0.5">{promoCode} — 10% off</p>}
                  </div>
                </div>
                <FaChevronRight size={10} className={`text-lacquered-licorice/30 transition-transform duration-300 ${promoOpen ? "rotate-90" : ""}`} />
              </button>
              {promoOpen && (
                <div className="px-5 pb-5 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code..."
                    className="flex-1 bg-albescent-white border border-lacquered-licorice/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-copper-green/20"
                  />
                  <button
                    onClick={() => { if (promoCode === "SNITCH10") { setPromoApplied(true); setPromoOpen(false); } }}
                    className="bg-lacquered-licorice text-albescent-white px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-copper-green transition-colors flex items-center gap-1.5"
                  >
                    {promoApplied ? <FaCheck size={10} /> : null} Apply
                  </button>
                </div>
              )}
            </div>

            {/* Free shipping progress */}
            {(cart.totalAmount || 0) < FREE_SHIPPING_THRESHOLD && (
              <div className="mt-4 bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-2">
                  Add INR {(FREE_SHIPPING_THRESHOLD - (cart.totalAmount || 0)).toLocaleString()} more for free shipping
                </p>
                <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((cart.totalAmount || 0) / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
