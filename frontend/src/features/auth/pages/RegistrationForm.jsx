import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { useAuth } from "../hook/useAuth.js";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eyetoggle, setEyetoggle] = useState(true);
  const [error, setError] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const { handleRegister, loading } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await handleRegister({
      email,
      contact: contactNumber,
      password,
      fullname: username,
      isSeller,
    });

    if (!result.success) {
      setError(result.error || "Registration failed");
      return;
    }

    // Navigation to /verify-otp is handled inside useAuth.handleRegister
    setEmail("");
    setUsername("");
    setPassword("");
    setContactNumber("");

  };

  const inputClass =
    "w-full bg-copper-green/10 text-lacquered-licorice font-normal placeholder-lacquered-licorice/30 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-playing-hooky border border-copper-green/20 transition-all";

  if (loading) return <Loader />;

  return (
    <main className="relative flex justify-center items-center min-h-screen bg-desert-khaki overflow-hidden pt-32 pb-10">
      <Nav />

      <div
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm bg-albescent-white/40 backdrop-blur-md border border-copper-green/20 rounded-2xl px-8 py-6 
shadow-[0_10px_30px_rgba(63,78,60,0.1)]"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-copper-green flex items-center justify-center mb-2 shadow-[0_5px_15px_rgba(63,78,60,0.2)]">
            <div className="w-6 h-6 bg-albescent-white rounded-sm animate-soft-rotate"></div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-lacquered-licorice">
            Create an account
          </h1>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 w-full">
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            name="username"
            placeholder="Username"
            className={inputClass}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name="email"
            placeholder="Email address"
            className={inputClass}
          />
          <input
            onChange={(e) => setContactNumber(e.target.value)}
            value={contactNumber}
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            className={inputClass}
          />
          <div className="relative w-full">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={eyetoggle ? "password" : "text"}
              name="password"
              placeholder="Password"
              className={inputClass}
            />
            <div
              onClick={() => setEyetoggle(!eyetoggle)}
              className="absolute right-4 top-3.5 cursor-pointer text-lacquered-licorice/30 hover:text-lacquered-licorice/60 transition"
            >
              <i
                className={`ri-${eyetoggle ? "eye-off-line" : "eye-line"} text-lg`}
              ></i>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => setIsSeller(!isSeller)}
              className="text-lacquered-licorice/50 hover:text-lacquered-licorice transition-colors font-medium cursor-pointer"
            >
              Register as {isSeller ? "Buyer" : "Seller"}
            </button>
            <span className="text-playing-hooky font-medium">
              {isSeller ? "Seller account" : "Buyer account"}
            </span>
          </div>

          <div>
            <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-copper-green text-albescent-white font-semibold py-3.5 hover:bg-lacquered-licorice transition-all active:scale-[0.98] cursor-pointer mt-3 shadow-[0_4px_12px_rgba(63,78,60,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
          <div className="text-center my-3 text-sm text-gray-500">
            ---------- or ----------
          </div>
            <a className="flex items-center justify-center rounded-full bg-white px-3 py-3 cursor-pointer hover:bg-copper-green/20 transition-all active:scale-[0.98] shadow-[0_4px_12px_rgba(63,78,60,0.2)]" href="/api/auth/google">
              <i className="fa-brands fa-google text-lg"></i> 
            </a>
          </div>
        </form>

        <p className="text-lacquered-licorice/50 text-sm font-medium">
          Already have an account?{" "}
          <Link
            className="text-copper-green font-semibold hover:underline underline-offset-4"
            to="/login"
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="absolute bottom-6 flex gap-4 text-[11px] text-lacquered-licorice/30 font-medium tracking-wide">
        <span>Terms of use</span>
        <span className="w-1 h-1 bg-lacquered-licorice/20 rounded-full mt-1.5"></span>
        <span>Privacy policy</span>
      </div>
    </main>
  );
};

export default RegistrationForm;
