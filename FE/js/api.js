const API_URL = "http://localhost:5000";
import { logRequest } from "./script.js";

// ─── API WRAPPER ──────────────────────────────────────────
export async function api(method, path, body = null) {
  const token = localStorage.getItem("token");
  const url = API_URL + path;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  //auth routing
  if (res.status === 401) {
    localStorage.removeItem("token");
    const isAuthPage = window.location.pathname.includes("index.html");
    if (!isAuthPage) {
      window.location.href = "../index.html";
      return;
    }
    throw new Error("Invalid credentials");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }

  logRequest(method, path, res.status);
  console.log("status:", res.status, "ok:", res.ok);

  if (res.status === 204) return null;

  return res.json();
}
