import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hook/useCart";
import Nav from "../../products/components/Nav";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaReceipt,
} from "react-icons/fa";

const statusConfig = {
  paid: {
    label: "Paid",
    icon: FaCheckCircle,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  pending: {
    label: "Pending",
    icon: FaClock,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  failed: {
    label: "Failed",
    icon: FaTimesCircle,
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100",
  },
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { handleGetMyOrders } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await handleGetMyOrders();
      if (res.success) setOrders(res.orders || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-albescent-white font-sans text-lacquered-licorice">
      <Nav />

      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-lacquered-licorice/40 hover:text-copper-green transition-colors mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            My <span className="text-copper-green">Orders</span>
          </h1>
          <div className="h-px flex-1 bg-lacquered-licorice/10 ml-4" />
          <span className="text-xs font-black bg-lacquered-licorice text-albescent-white px-4 py-1.5 rounded-full tracking-widest leading-none">
            {orders.length} ORDERS
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-copper-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-desert-khaki/30 rounded-full flex items-center justify-center mb-8">
              <FaBox size={32} className="text-lacquered-licorice/20" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-3">
              No Orders Yet
            </h2>
            <p className="text-lacquered-licorice/40 text-sm font-medium mb-8 max-w-xs">
              Once you make a purchase, your orders will appear here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 bg-lacquered-licorice text-albescent-white px-10 py-4 rounded-full font-black tracking-widest text-[10px] hover:bg-copper-green transition-all duration-500 shadow-2xl"
            >
              SHOP NOW
              <FaArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <AnimatePresence>
            <div className="space-y-6">
              {orders.map((order, i) => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white rounded-[2rem] border border-lacquered-licorice/5 overflow-hidden hover:shadow-xl hover:shadow-lacquered-licorice/5 transition-all duration-500"
                  >
                    {/* Order header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-6 border-b border-lacquered-licorice/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-copper-green/10 rounded-2xl flex items-center justify-center">
                          <FaReceipt size={16} className="text-copper-green" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-lacquered-licorice/30 mb-1">
                            Order ID
                          </p>
                          <p className="text-xs font-black text-lacquered-licorice font-mono truncate max-w-[200px]">
                            {order.razorpay?.order_id || order._id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-lacquered-licorice/30 mb-1">
                            Date
                          </p>
                          <p className="text-xs font-bold">{date}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.border} border`}>
                          <StatusIcon size={11} className={cfg.text} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order items */}
                    {order.orderSnapshot && order.orderSnapshot.length > 0 && (
                      <div className="px-8 py-5 space-y-4">
                        {order.orderSnapshot.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-5">
                            {item.image ? (
                              <div className="w-16 h-20 rounded-xl overflow-hidden bg-desert-khaki/20 shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-20 rounded-xl bg-desert-khaki/30 flex items-center justify-center shrink-0">
                                <FaBox size={18} className="text-lacquered-licorice/20" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-sm uppercase tracking-tight truncate">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-lacquered-licorice/40 font-bold mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-black text-sm text-copper-green shrink-0">
                              {item.price?.currency} {((item.price?.amount || 0) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Order footer total */}
                    <div className="px-8 py-5 bg-lacquered-licorice/[0.02] border-t border-lacquered-licorice/5 flex justify-between items-center">
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-lacquered-licorice/40">
                        Total Paid
                      </p>
                      <p className="text-2xl font-black tracking-tighter text-lacquered-licorice">
                        {order.price?.currency}{" "}
                        {Number(order.price?.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
