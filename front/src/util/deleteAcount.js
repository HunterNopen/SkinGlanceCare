import { getToken, getUserId, logout } from "./auth";

export async function deleteAccount() {
  const token = getToken();
  const userId = getUserId();

  if (!token || !userId) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`http://localhost:8000/users/${userId}`, {
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
