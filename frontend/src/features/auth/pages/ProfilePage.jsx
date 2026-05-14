import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import Nav from "../../products/components/Nav";
import { useToast } from "../../common/Toast";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaStore,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const InputField = ({ label, id, type = "text", value, onChange, disabled, icon: Icon, readOnly }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-[9px] font-black uppercase tracking-[0.25em] text-lacquered-licorice/40">
      {label}
    </label>
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
      readOnly || disabled
        ? "bg-lacquered-licorice/3 border-lacquered-licorice/8"
        : "bg-white border-lacquered-licorice/15 focus-within:border-copper-green/50 focus-within:shadow-[0_0_0_3px_rgba(44,62,41,0.06)]"
    }`}>
      <Icon size={13} className={readOnly || disabled ? "text-lacquered-licorice/20" : "text-copper-green/60"} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        className="flex-1 bg-transparent text-sm font-bold text-lacquered-licorice placeholder:text-lacquered-licorice/25 outline-none disabled:text-lacquered-licorice/40"
      />
    </div>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state) => state.auth.user);
  const { handleUpdateProfile, handleForgetPassword, loading } = useAuth();

  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [contact, setContact] = useState(user?.contact || "");
  const [resettingPw, setResettingPw] = useState(false);

  const handleSave = async () => {
    const res = await handleUpdateProfile({ fullname, contact });
    if (res.success) {
      toast.success("Profile updated successfully!");
      setEditing(false);
    } else {
      toast.error(res.error || "Failed to update profile.");
    }
  };

  const handleCancelEdit = () => {
    setFullname(user?.fullname || "");
    setContact(user?.contact || "");
    setEditing(false);
  };

  const handlePasswordReset = async () => {
    setResettingPw(true);
    const res = await handleForgetPassword({ email: user?.email });
    setResettingPw(false);
    if (res.success) {
      toast.success("Password reset OTP sent to your email!");
      navigate("/forget-password");
    } else {
      toast.error(res.error || "Failed to send reset OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-albescent-white font-sans text-lacquered-licorice">
      <Nav />

      <main className="container mx-auto max-w-2xl px-6 py-16">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-lacquered-licorice/40 hover:text-copper-green transition-colors mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="flex items-end gap-4 mb-12">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            My <span className="text-copper-green">Profile</span>
          </h1>
          <div className="h-px flex-1 bg-lacquered-licorice/10 mb-2" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Avatar card */}
          <div className="bg-lacquered-licorice text-albescent-white rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-copper-green/15 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-copper-green/20 border border-copper-green/30 flex items-center justify-center shrink-0">
                {user?.role === "seller" ? (
                  <FaStore size={28} className="text-playing-hooky" />
                ) : (
                  <FaUser size={28} className="text-playing-hooky" />
                )}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-albescent-white/30 mb-1">
                  {user?.role === "seller" ? "Seller Account" : "Buyer Account"}
                </p>
                <h2 className="text-2xl font-black tracking-tight">{user?.fullname || "User"}</h2>
                <p className="text-albescent-white/40 text-xs font-medium mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Details card */}
          <div className="bg-white rounded-[2rem] border border-lacquered-licorice/5 p-8 space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-lacquered-licorice/40">
                Account Details
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-copper-green hover:text-lacquered-licorice transition-colors"
                >
                  <FaEdit size={10} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-lacquered-licorice/40 hover:text-red-500 transition-colors"
                  >
                    <FaTimes size={10} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-copper-green text-albescent-white px-4 py-2 rounded-xl hover:bg-lacquered-licorice transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaCheck size={10} />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>

            <InputField
              label="Full Name"
              id="fullname"
              icon={FaUser}
              value={editing ? fullname : (user?.fullname || "")}
              onChange={(e) => setFullname(e.target.value)}
              readOnly={!editing}
              disabled={loading}
            />

            <InputField
              label="Email Address"
              id="email"
              type="email"
              icon={FaEnvelope}
              value={user?.email || ""}
              readOnly
            />

            <InputField
              label="Phone Number"
              id="contact"
              icon={FaPhone}
              value={editing ? contact : (user?.contact || "—")}
              onChange={(e) => setContact(e.target.value)}
              readOnly={!editing}
              disabled={loading}
            />
          </div>

          {/* Security card */}
          <div className="bg-white rounded-[2rem] border border-lacquered-licorice/5 p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-lacquered-licorice/40 mb-6">
              Security
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-copper-green/10 flex items-center justify-center">
                  <FaShieldAlt size={16} className="text-copper-green" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">Password</p>
                  <p className="text-[10px] text-lacquered-licorice/30 font-medium mt-0.5">
                    Last changed: unknown
                  </p>
                </div>
              </div>
              <button
                onClick={handlePasswordReset}
                disabled={resettingPw || loading}
                className="text-[9px] font-black uppercase tracking-widest border border-lacquered-licorice/15 px-5 py-2.5 rounded-xl hover:bg-lacquered-licorice hover:text-albescent-white hover:border-lacquered-licorice transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resettingPw && (
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                Change Password
              </button>
            </div>
          </div>

          {/* Role badge */}
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="h-px flex-1 bg-lacquered-licorice/5" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-lacquered-licorice/20 px-4">
              {user?.isVerified ? "✓ Verified Account" : "⚠ Unverified"}
            </span>
            <div className="h-px flex-1 bg-lacquered-licorice/5" />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;
