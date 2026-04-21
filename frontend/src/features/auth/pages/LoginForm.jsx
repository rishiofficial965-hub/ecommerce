import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import { FaEye, FaEyeSlash, FaGoogle, FaShoppingBag } from "react-icons/fa";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [useEmailLogin, setUseEmailLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleLogin, handleForgetPassword, loading } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) navigate(user.role === "seller" ? "/seller/dashboard" : "/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const credentials = useEmailLogin ? { email, password } : { username, password };
    const result = await handleLogin(credentials);
    if (!result.success) {
      setError(result.error || "Invalid credentials");
      setPassword("");
      if (result.unverified) navigate("/verify-otp");
      return;
    }
    navigate(result.user.role === "buyer" ? "/" : "/seller/dashboard");
  };

  const handleForgotPassword = async () => {
    if (!useEmailLogin) { setUseEmailLogin(true); setError("Enter your email to reset password."); return; }
    if (!email) { setError("Please enter your email address."); return; }
    const result = await handleForgetPassword({ email });
    if (!result.success) { setError(result.error); return; }
    navigate("/forget-password");
  };

  const inputBase = "w-full bg-white/60 border border-lacquered-licorice/10 text-lacquered-licorice placeholder:text-lacquered-licorice/30 px-4 py-3.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-copper-green/30 focus:border-copper-green/40 focus:bg-white transition-all";

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left panel — branding ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-lacquered-licorice relative overflow-hidden flex-col items-center justify-center p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=900')] bg-cover bg-center opacity-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-copper-green/20 to-transparent" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-playing-hooky/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-copper-green rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-albescent-white font-black text-lg">S</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-albescent-white">SNITCH</span>
          </div>
          <h2 className="text-5xl font-black text-albescent-white tracking-tighter leading-none mb-4 uppercase italic">
            Style Is<br /><span className="text-playing-hooky">Everything.</span>
          </h2>
          <p className="text-albescent-white/40 text-sm font-medium max-w-xs mx-auto leading-relaxed">
            Sign in to access your orders, wishlist, and exclusive early drops.
          </p>

          <div className="mt-16 grid grid-cols-3 gap-6">
            {["Free Returns", "Secure Pay", "New Drops"].map((t) => (
              <div key={t} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-albescent-white/40">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────── */}
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
            <h1 className="text-3xl font-black text-lacquered-licorice tracking-tighter mb-1">Welcome back</h1>
            <p className="text-lacquered-licorice/40 text-sm font-medium">Sign in to your account to continue.</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <p className="text-red-600 text-xs font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!useEmailLogin ? (
              <input value={username} onChange={(e) => setUsername(e.target.value)}
                type="text" name="username" placeholder="Username" required className={inputBase} />
            ) : (
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                type="email" name="email" placeholder="Email address" required className={inputBase} />
            )}

            <div className="relative">
              <input value={password} onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"} name="password" placeholder="Password" required className={inputBase} />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lacquered-licorice/30 hover:text-lacquered-licorice transition-colors">
                {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={() => setUseEmailLogin((v) => !v)}
                className="text-[11px] font-bold text-lacquered-licorice/40 hover:text-copper-green transition-colors uppercase tracking-widest">
                Use {useEmailLogin ? "username" : "email"}
              </button>
              <button type="button" onClick={handleForgotPassword}
                className="text-[11px] font-bold text-copper-green hover:text-lacquered-licorice transition-colors">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-lacquered-licorice text-albescent-white font-black py-4 rounded-2xl hover:bg-copper-green transition-all duration-500 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-widest uppercase mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Continue"}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-lacquered-licorice/8" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-lacquered-licorice/25">or</span>
              <div className="flex-1 h-px bg-lacquered-licorice/8" />
            </div>

            <a href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full bg-white border border-lacquered-licorice/10 rounded-2xl py-3.5 text-xs font-black uppercase tracking-widest text-lacquered-licorice hover:bg-lacquered-licorice hover:text-albescent-white transition-all duration-300 shadow-sm active:scale-95">
              <FaGoogle size={14} /> Continue with Google
            </a>
          </form>

          <p className="mt-8 text-center text-sm text-lacquered-licorice/40 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-copper-green font-black hover:underline underline-offset-4">Sign up</Link>
          </p>

          <div className="mt-10 flex justify-center gap-4 text-[10px] text-lacquered-licorice/20 font-bold uppercase tracking-widest">
            <span className="cursor-pointer hover:text-lacquered-licorice/40 transition-colors">Terms</span>
            <span>·</span>
            <span className="cursor-pointer hover:text-lacquered-licorice/40 transition-colors">Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
