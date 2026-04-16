import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { useAuth } from "../hook/useAuth";

const ForgetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { handleResetPasswordOtp, loading, pendingUserId } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!pendingUserId) {
      setError(
        "Session expired. Please request a new OTP from the login page.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    const result = await handleResetPasswordOtp({
      userId: pendingUserId,
      otp,
      newPassword,
      confirmPassword,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setError(result.error || "Failed to reset password. Please try again.");
    }
  }

  const inputClass =
    "w-full bg-copper-green/10 text-lacquered-licorice font-normal placeholder-lacquered-licorice/30 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-playing-hooky border border-copper-green/20 transition-all";

  if (loading) return <Loader />;

  return (
    <main className="relative flex justify-center items-center min-h-screen bg-desert-khaki overflow-hidden pt-32 pb-10">
      <Nav />

      {/* Background Decorative Elements */}
      <div className="absolute top-20 -left-20 w-64 h-64 bg-copper-green/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-playing-hooky/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div
        className="relative z-10 flex flex-col items-center gap-4 w-full max-w-md bg-albescent-white/40 backdrop-blur-md border border-copper-green/20 rounded-2xl px-8 py-4 
shadow-[0_10px_30px_rgba(63,78,60,0.1)]"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-14 h-14 rounded-full bg-copper-green flex items-center justify-center mb-2 shadow-[0_5px_15px_rgba(63,78,60,0.2)]">
            <i className="ri-lock-password-line text-2xl text-albescent-white "></i>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-lacquered-licorice">
            Reset Password
          </h1>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="w-full bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
            <p className="text-green-600 text-sm text-center font-medium">
              Password reset successfully! Redirecting to login...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-lacquered-licorice/60 uppercase tracking-widest ml-1">
                Security Code
              </label>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                type="text"
                placeholder="6-digit OTP"
                maxLength={6}
                className={`${inputClass} text-center tracking-[0.5em] text-md font-bold font-mono`}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-lacquered-licorice/60 uppercase tracking-widest ml-1">
                New Password
              </label>
              <div className="relative w-full">
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  className={inputClass}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 cursor-pointer text-lacquered-licorice/30 hover:text-lacquered-licorice/60 transition"
                >
                  <i
                    className={`ri-${showPassword ? "eye-line" : "eye-off-line"} text-lg`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-lacquered-licorice/60 uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className={inputClass}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-xl bg-copper-green text-albescent-white font-semibold py-4 hover:bg-lacquered-licorice transition-all active:scale-[0.98] cursor-pointer mt-2 shadow-[0_4px_12px_rgba(63,78,60,0.2)] disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>

        <Link
          to="/login"
          className="text-lacquered-licorice/50 text-sm font-medium hover:text-copper-green transition-colors mt-2"
        >
          Back to Login
        </Link>
      </div>

      <div className="absolute bottom-6 flex gap-4 text-[11px] text-lacquered-licorice/30 font-medium tracking-wide">
        <span>Secure Transaction</span>
        <span className="w-1 h-1 bg-lacquered-licorice/20 rounded-full mt-1.5"></span>
        <span>End-to-End Encrypted</span>
      </div>
    </main>
  );
};

export default ForgetPassword;
