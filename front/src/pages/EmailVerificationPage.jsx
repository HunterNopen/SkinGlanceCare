import React, { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const userEmail = localStorage.getItem("signup_email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { resending, resendVerificationEmail } = useAuthStore();
  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newCode = pasted.split("");
    setCode((prev) => prev.map((_, i) => newCode[i] || ""));

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      setTimeout(() => navigate("/FinalForm/?mode=login"), 1000);
    } catch (err) {
      toast.error(err?.message || "Verification failed");
    }
  };

  return (
    <main className="flex items-center justify-center bg-[#ABD3D2] w-full min-h-screen px-4 sm:px-6 lg:px-20 py-10">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md sm:max-w-lg rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col items-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center bg-linear-to-r from-[#4DA19F] to-[#334F4F] bg-clip-text text-transparent">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg">
          Enter the 6-digit code sent to <br />
          <span className="font-semibold">{userEmail}</span>
        </p>

        <form className="mt-6 w-full">
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="flex-1 min-w-[40px] max-w-[50px] h-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold bg-[#f8f8f8] border-2 border-[#4DA19F] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DA19F]"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 font-semibold mt-3 text-center">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            disabled={isLoading || code.some((digit) => !digit)}
            onClick={handleSubmit}
            className="mt-6 w-full bg-linear-to-r from-[#4DA19F] to-[#334F4F] text-white font-semibold py-3 rounded-2xl shadow-md hover:from-[#334F4F] hover:to-[#4DA19F] disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>

          <div className="mt-4 flex justify-center w-full">
            <button
              type="button"
              onClick={() => resendVerificationEmail(userEmail)}
              disabled={resending}
              className="w-full sm:w-auto bg-[#E0E7FF] hover:bg-[#c5d8f4] text-[#334F4F] font-semibold py-2 px-6 rounded-2xl disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
};

export default EmailVerificationPage;
