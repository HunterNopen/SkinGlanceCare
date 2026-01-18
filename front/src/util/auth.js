export function getToken() {
  return localStorage.getItem("token");
}

export function getUserId() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
}
