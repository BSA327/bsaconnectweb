import { jwtDecode } from "jwt-decode";

export function saveAuth(token, apiUser = {}) {
  let claims = {};
  try {
    claims = jwtDecode(token);
  } catch {}

  const user = {
    userId: apiUser.userId ?? claims.userId ?? claims.userid ?? claims.sub,
    role: apiUser.role ?? claims.role,
    loginName:
      apiUser.loginName ??
      apiUser.username ??
      claims.loginName ??
      claims.username ??
      claims.userName
  };

  localStorage.setItem("bsa_token", token);
  localStorage.setItem("bsa_user", JSON.stringify(user));
  return user;
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("bsa_user") || "null");
  } catch {
    return null;
  }
}

export function getRole() {
  return String(getUser()?.role || "")
    .replace("ROLE_", "")
    .toUpperCase();
}

export function logout() {
  localStorage.removeItem("bsa_token");
  localStorage.removeItem("bsa_user");
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("bsa_token"));
}