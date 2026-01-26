import { fetchWithAuth } from "./api";

export async function getImages() {
  const res = await fetchWithAuth("/images");
  if (!res.ok) throw new Error("Failed to fetch images");
  return res.json();
}

export async function getImageById(id) {
  const res = await fetchWithAuth(`/images/${id}`);
  if (!res.ok) throw new Error("Failed to fetch image");
  return res.json();
}

export async function deleteImage(id) {
  const res = await fetchWithAuth(`/images/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete image");
  return true;
}

export async function getImagesHistory(skip = 0, limit = 8) {
  const res = await fetchWithAuth(`/users/history?skip=${skip}&limit=${limit}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ? JSON.stringify(err.detail) : "Unknown error");
  }

  return res.json();
}
