import { getToken, getUserId, logout } from "./auth";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export async function deleteAccount() {
  const token = getToken();
  const userId = getUserId();

  if (!token || !userId) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete account");
  }

  logout();
}
