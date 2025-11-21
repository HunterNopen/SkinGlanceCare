import {getAuthToken} from "../util/auth.js";

const API_URL = "http://localhost:8000/images"; // Twój backend
const token = getAuthToken();
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