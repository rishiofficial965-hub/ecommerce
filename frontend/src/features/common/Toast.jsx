import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

const ICONS = {
  success: <FaCheckCircle className="text-copper-green" size={16} />,
  error:   <FaTimesCircle  className="text-red-400"     size={16} />,
  info:    <FaInfoCircle   className="text-blue-400"    size={16} />,
};

const BAR_COLORS = {
  success: "bg-copper-green",
  error:   "bg-red-400",
  info:    "bg-blue-400",
};

// ─── Single Toast ─────────────────────────────────────────────────────────────
function Toast({ id, type = "info", message, duration = 3500, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit={{    opacity: 0, y: 20, scale: 0.92  }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className="relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md text-lacquered-licorice rounded-2xl shadow-2xl shadow-lacquered-licorice/10 px-4 py-3.5 border border-lacquered-licorice/5 overflow-hidden"
    >
      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${BAR_COLORS[type]}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%"   }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />

      {/* Icon */}
      <span className="mt-0.5 shrink-0">{ICONS[type]}</span>

      {/* Message */}
      <p className="flex-1 text-xs font-semibold leading-relaxed text-lacquered-licorice/80">
        {message}
      </p>

      {/* Close */}
      <button
        onClick={() => onRemove(id)}
        className="shrink-0 mt-0.5 text-lacquered-licorice/30 hover:text-lacquered-licorice transition-colors"
      >
        <FaTimes size={11} />
      </button>
    </motion.div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, type = "info", duration = 3500) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => remove(id), duration + 400); // +400 for exit animation
    return id;
  }, [remove]);

  const toast = {
    success: (msg, dur) => show(msg, "success", dur),
    error:   (msg, dur) => show(msg, "error",   dur),
    info:    (msg, dur) => show(msg, "info",     dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal-like fixed overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast {...t} onRemove={remove} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
