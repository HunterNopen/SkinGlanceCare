import { create } from "zustand";
import axios from "axios";



const API_URL = "http://127.0.0.1:8000";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,  
  isCheckingAuth: false,
  isSaving: false,

  signup: async (password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        password,
      });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errMsg = error.response?.data?.detail || "Signup failed";
      set({ error: errMsg, isLoading: false });
      throw error;
    }
  },
checkAuth: async () => {
  console.log("Running checkAuth...");
  set({ isCheckingAuth: true, error: null });

  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token);

  if (!token) {
    set({ isAuthenticated: false, user: null, isCheckingAuth: false });
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/auth/check-auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User data from check-auth:", response.data);
    set({
      user: response.data,
      isAuthenticated: true,
      isCheckingAuth: false,
    });
  } catch (error) {
    console.log("checkAuth failed:", error.response?.data || error.message);
    localStorage.removeItem("token");
    set({
      error: null,
      isCheckingAuth: false,
      isAuthenticated: false,
      user: null,
    });
  }
},

login: async (username, password) => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    const token = response.data.access_token;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Wywołaj checkAuth po zalogowaniu, aby pobrać pełne dane użytkownika
    await useAuthStore.getState().checkAuth();

    set({
      isLoading: false,
      error: null,
    });
  } catch (error) {
    const errMsg = error.response?.data?.detail || "Login failed";
    set({ error: errMsg, isLoading: false, isAuthenticated: false });
    throw error;
  }
},

   saveAnalysisResult: async (filename, cancer_probability) => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ error: "No token found. Please log in." });
      return;
    }

    try {
      set({ isSaving: true, error: null });
      await axios.post(
        "http://localhost:8000/auth/analysis/save",
        { filename, cancer_probability },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      const errMsg =
        error.response?.data?.detail || "Save failed.";
      set({ error: errMsg });
    } finally {
      set({ isSaving: false });
    }
  },

}));
