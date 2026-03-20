import api from "./api";

const TOKEN_KEY = "auth_token";

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);
  const { access_token: token } = response.data;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  return response.data;
}

export async function getProfile() {
  const response = await api.get("/profile");
  return response.data;
}

export async function changePassword(payload) {
  const response = await api.post("/auth/change-password", payload);
  return response.data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
