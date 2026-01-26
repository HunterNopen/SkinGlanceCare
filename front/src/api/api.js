const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/auth";
    throw new Error("Token expired");
  }

  return response;
}
