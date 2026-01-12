import { fetchWithAuth } from "./api";

export async function getImages() {
  const res = await fetchWithAuth("/images");
  return res.json();
}

export async function getImageById(id) {
  const res = await fetchWithAuth(`/images/${id}`);
  return res.json();
}

export async function deleteImage(id) {
  const res = await fetchWithAuth(`/images/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete image");
  }
  return true;
}
