import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  isLoading: false,
  error: null,

  verifyEmail: async (code, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `http://localhost:8000/access/verify_email/`,
        { code, email }
      );
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
      await axios.post(
        "http://localhost:8000/access/resend_verification_email/",
        { email }
      );
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
}));
