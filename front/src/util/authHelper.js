import { useAuthStore } from "../store/authStore";

export function loginUser(user, token) {
  useAuthStore.getState().login(user, token);
}

export function logoutUser() {
  useAuthStore.getState().logout();
}
