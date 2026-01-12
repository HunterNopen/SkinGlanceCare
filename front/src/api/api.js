const BASE_URL = "http://localhost:8000";

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
