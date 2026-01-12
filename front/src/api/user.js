import { fetchWithAuth } from "../api/api";

export async function getMe() {
  const res = await fetchWithAuth("/users/me");

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return res.json();
}
