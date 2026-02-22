import { api } from "./api.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const goRegisterBtn = document.getElementById("go-register");
const goLoginBtn = document.getElementById("go-login");

// --- UI TOGGLE LOGIC ---
goRegisterBtn.addEventListener("click", () => {
  console.log("Switching to Register");
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
});

goLoginBtn.addEventListener("click", () => {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
});

function setAuthStatus(message, type) {
  const statusEl = document.getElementById("auth-status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;

  setTimeout(() => {
    statusEl.textContent = "";
    statusEl.className = "status-message";
  }, 4000);
}

// --- LOGIN HANDLER ---
async function handleLogin(e) {
  e.preventDefault();
  const btn = loginForm.querySelector("button");
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const data = await api("POST", "/auth/login", { email, password });
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard/todos.html";
    }
  } catch (err) {
    console.error("Login Error:", err);
    setAuthStatus("Login failed: Invalid credentials", "error");
  }
}

// --- REGISTER HANDLER  ---
async function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;

  if (password.length < 6) {
    return setAuthStatus("Password too short", "error");
  }

  if (password !== confirm) {
    return setAuthStatus("Passwords do not match!", "error");
  }

  try {
    const data = await api("POST", "/auth/register", { email, password });

    if (data && (data.token || data.message)) {
      setAuthStatus("Registration successful!", "success");
      document.getElementById("go-login").click();
    }
  } catch (err) {
    setAuthStatus("Error: " + err.message, "error");
  }
}

// --- ATTACH LISTENERS ---
loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegister);
