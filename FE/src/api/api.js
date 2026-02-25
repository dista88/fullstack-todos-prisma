const API_URL = import.meta.env.VITE_API_URL;

async function api(method, path, body = null, onLog = null) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(API_URL + path, options);
  if (onLog) onLog(method, path, res.status);
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/auth";
    return;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const getTodos = (log) => api("GET", "/todos", null, log);
export const createTodo = (title, log) => api("POST", "/todos", { title }, log);
export const updateTodo = (id, completed, log) =>
  api("PATCH", `/todos/${id}`, { completed }, log);
export const deleteTodo = (id, log) => api("DELETE", `/todos/${id}`, null, log);
