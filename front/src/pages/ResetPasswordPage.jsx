import { ArrowLeft, Loader, Lock } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import React, { useState } from "react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPassword, error, isLoading, message } = useAuthStore();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  console.log(token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/FinalForm/?mode=login");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#ABD3D2] px-4 sm:px-6 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md sm:max-w-lg rounded-3xl shadow-xl p-6 sm:p-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent">
          Reset Password
        </h2>

        <p className="text-center text-gray-600 mt-3 text-base sm:text-lg">
          Set your new password
        </p>

        {error && (
          <p className="text-red-500 font-semibold mt-4 text-center">{error}</p>
        )}

        {message && (
          <p className="text-green-600 font-semibold mt-4 text-center">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#4DA19F] bg-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#4DA19F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#4DA19F] bg-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#4DA19F]"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold py-3 rounded-2xl shadow-md hover:from-[#334F4F] hover:to-[#4DA19F] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              "Set New Password"
            )}
          </motion.button>
        </form>

        <div className="mt-8 flex justify-center">
          <Link
            to="/FinalForm/?mode=login"
            className="flex items-center text-[#334F4F] font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default ResetPasswordPage;
