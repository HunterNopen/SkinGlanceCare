import axios from "axios";
import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  isLoading: false,
  error: null,

  verifyEmail: async (code, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/access/verify_email/`, {
        code,
        email,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.detail || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  resendVerificationEmail: async (email) => {
    set({ resending: true, error: null });
    try {
      console.log(email);
      await axios.post(`${BASE_URL}/access/resend_verification_email/`, {
        email,
      });
      // toast.success("New verification code sent to your email");
    } catch (err) {
      set({
        error:
          err.response?.data?.detail || "Failed to resend verification code",
      });
      // toast.error(
      //   err.response?.data?.detail || "Failed to resend verification code"
      // );
    } finally {
      set({ resending: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      console.log("FORGOT PASSWORD EMAIL:", email);
      const response = await axios.post(`${BASE_URL}/access/forgot-password`, {
        email,
      });

      set({
        message: response.data.message,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.detail || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_URL}/access/reset-password`, {
        token,
        new_password: password,
      });

      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const detail = error.response?.data?.detail;

      set({
        isLoading: false,
        error: Array.isArray(detail)
          ? detail[0]?.msg
          : detail || "Error resetting password",
      });
      throw error;
    }
  },
}));
