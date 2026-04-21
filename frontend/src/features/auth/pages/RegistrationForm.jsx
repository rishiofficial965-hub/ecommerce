import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { FaEye, FaEyeSlash, FaGoogle, FaStore, FaUser } from "react-icons/fa";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) navigate(user.role === "seller" ? "/seller/dashboard" : "/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await handleRegister({ email, contact: contactNumber, password, fullname: username, isSeller });
    if (!result.success) { setError(result.error || "Registration failed"); return; }
    navigate("/verify-otp");
  };

  const inputBase = "w-full bg-white/60 border border-lacquered-licorice/10 text-lacquered-licorice placeholder:text-lacquered-licorice/30 px-4 py-3.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-copper-green/30 focus:border-copper-green/40 focus:bg-white transition-all";

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left branding panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-lacquered-licorice relative overflow-hidden flex-col items-center justify-center p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=900')] bg-cover bg-center opacity-10" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-copper-green/20 to-transparent" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-playing-hooky/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-copper-green rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-albescent-white font-black text-lg">S</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-albescent-white">SNITCH</span>
          </div>
          <h2 className="text-5xl font-black text-albescent-white tracking-tighter leading-none mb-4 uppercase italic">
            Join the<br /><span className="text-copper-green">Movement.</span>
          </h2>
          <p className="text-albescent-white/40 text-sm font-medium max-w-xs mx-auto leading-relaxed">
            Create your account and get exclusive access to new drops, member-only deals, and priority support.
          </p>

          <div className="mt-12 space-y-3">
            {[
              { icon: "✓", text: "Free shipping on first order" },
              { icon: "✓", text: "Early access to new collections" },
              { icon: "✓", text: "Exclusive member-only discounts" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-3 text-left">
                <span className="w-5 h-5 bg-copper-green/20 rounded-full flex items-center justify-center text-copper-green text-[10px] font-black shrink-0">{b.icon}</span>
                <p className="text-albescent-white/40 text-xs font-medium">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 bg-albescent-white flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-9 h-9 bg-copper-green rounded-xl flex items-center justify-center shadow-md">
            <span className="text-albescent-white font-black text-lg">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-lacquered-licorice">SNITCH</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-lacquered-licorice tracking-tighter mb-1">Create account</h1>
            <p className="text-lacquered-licorice/40 text-sm font-medium">Join thousands of Snitch shoppers today.</p>
          </div>

          {/* Account type toggle */}
          <div className="flex bg-white border border-lacquered-licorice/8 rounded-2xl p-1 mb-5 shadow-sm">
            <button type="button" onClick={() => setIsSeller(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${!isSeller ? "bg-lacquered-licorice text-albescent-white shadow-md" : "text-lacquered-licorice/40 hover:text-lacquered-licorice"}`}>
              <FaUser size={11} /> Buyer
            </button>
            <button type="button" onClick={() => setIsSeller(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isSeller ? "bg-copper-green text-albescent-white shadow-md" : "text-lacquered-licorice/40 hover:text-lacquered-licorice"}`}>
              <FaStore size={11} /> Seller
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <p className="text-red-600 text-xs font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={username} onChange={(e) => setUsername(e.target.value)}
              type="text" name="username" placeholder="Full name" required className={inputBase} />
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" name="email" placeholder="Email address" required className={inputBase} />
            <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
              type="tel" name="contactNumber" placeholder="Phone number" className={inputBase} />

            <div className="relative">
              <input value={password} onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"} name="password" placeholder="Create password" required className={inputBase} />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lacquered-licorice/30 hover:text-lacquered-licorice transition-colors">
                {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-lacquered-licorice text-albescent-white font-black py-4 rounded-2xl hover:bg-copper-green transition-all duration-500 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-widest uppercase mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating…
                </span>
              ) : `Create ${isSeller ? "Seller" : ""} Account`}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-lacquered-licorice/8" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-lacquered-licorice/25">or</span>
              <div className="flex-1 h-px bg-lacquered-licorice/8" />
            </div>

            <a href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full bg-white border border-lacquered-licorice/10 rounded-2xl py-3.5 text-xs font-black uppercase tracking-widest text-lacquered-licorice hover:bg-lacquered-licorice hover:text-albescent-white transition-all duration-300 shadow-sm active:scale-95">
              <FaGoogle size={14} /> Continue with Google
            </a>
          </form>

          <p className="mt-6 text-center text-sm text-lacquered-licorice/40 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-copper-green font-black hover:underline underline-offset-4">Log in</Link>
          </p>

          <p className="mt-6 text-center text-[9px] font-medium text-lacquered-licorice/20 leading-relaxed">
            By creating an account, you agree to our{" "}
            <span className="text-lacquered-licorice/30 cursor-pointer hover:text-copper-green transition-colors">Terms of Service</span>
            {" "}and{" "}
            <span className="text-lacquered-licorice/30 cursor-pointer hover:text-copper-green transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
