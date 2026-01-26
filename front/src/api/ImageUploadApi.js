import { getToken } from "../util/auth.js";

const API_URL = `${import.meta.env.VITE_BASE_URL}/images`;
const token = getToken();
export async function uploadImage(file, token) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Upload failed");
  }

  const result = await response.json();
  return result;
}
