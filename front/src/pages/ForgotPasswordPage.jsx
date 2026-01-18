import { ArrowLeft, Loader, Mail } from "lucide-react";
import React, { useState } from "react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
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

        {!isSubmitted ? (
          <>
            <p className="text-center text-gray-600 mt-4 text-base sm:text-lg">
              Enter your email address and we’ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
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
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          </>
        ) : (
          <div className="mt-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-[#4DA19F] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>

            <p className="text-gray-700 text-base sm:text-lg">
              If an account exists for
              <br />
              <span className="font-semibold">{email}</span>
              <br />
              you will receive a password reset link shortly.
            </p>
          </div>
        )}

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

export default ForgotPasswordPage;
