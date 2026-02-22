import { api } from "./api.js";
// ─── STATE ────────────────────────────────────────────────
let todos = [];

// ─── DOM ─────────────────────────────────────────────
const todoForm = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const empty = document.getElementById("empty-state");

//document.getElementById("api-url").textContent = API_URL;

// ─── NETWORK LOG ──────────────────────────────────────────
export function logRequest(method, url, statusCode) {
  const logList = document.getElementById("log-list");
  if (!logList) return;
  const li = document.createElement("li");
  li.className = "log-entry";
  li.innerHTML = `
          <span class="method ${method}">${method}</span>
          <span class="log-url">${url}</span>
          <span class="log-status">${statusCode}</span>
        `;
  logList.prepend(li);
}

// ─── STATUS HELPER ────────────────────────────────────────
export function setStatus(msg, type = "loading") {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className = type;
  if (type !== "loading") setTimeout(() => (statusEl.className = ""), 4500);
}

// ─── RENDER ───────────────────────────────────────────────
function render() {
  const list = document.getElementById("todo-list");
  if (!list) return;
  list.textContent = "";
  empty.style.display = todos.length === 0 ? "block" : "none";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "done" : ""}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
          <input type="checkbox" ${todo.completed ? "checked" : ""} />
          <span class="todo-text">${todo.title}</span>
          <span class="todo-id">#${String(todo.id).slice(-4)}</span>
          <button class="delete-btn" title="Delete">✕</button>
        `;

    // COMPLETE —
    li.querySelector('input[type="checkbox"]').addEventListener(
      "change",
      () => {
        completeTodo(todo.id);
      }
    );

    // DELETE —
    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    list.appendChild(li);
  });
}

// ─── CRUD FUNCTIONS ───────────────────────────────────────

// READ — GET /todos
async function fetchTodos() {
  setStatus("fetching todos...", "loading");
  try {
    todos = await api("GET", "/todos");
    render();
    setStatus("loaded", "success");
  } catch (err) {
    setStatus("backend not connected. is your server running?", "error");

    render();
  }
}

// CREATE — POST /todos
async function addTodo(title) {
  setStatus("adding...", "loading");
  try {
    const newTodo = await api("POST", "/todos", { title });
    todos.unshift(newTodo);
    render();
    setStatus("todo added!", "success");
  } catch (err) {
    setStatus("failed to add todo", "error");
  }
}

// UPDATE — PATCH /todos/:id
async function completeTodo(id) {
  setStatus("updating...", "loading");

  const todo = todos.find((t) => t.id === id);
  const newStatus = !todo.completed;

  try {
    const updatedTodo = await api("PATCH", `/todos/${id}`, {
      completed: newStatus,
    });
    todos = todos.map((t) => (t.id === id ? updatedTodo : t));
    render();
    setStatus("todo updated!", "success");
  } catch (err) {
    setStatus("failed to update todo", "error");
  }
}

// DELETE — DELETE /todos/:id
async function deleteTodo(id) {
  setStatus("deleting...", "loading");
  try {
    await api("DELETE", `/todos/${id}`);
    todos = todos.filter((t) => t.id !== id);
    render();
    setStatus("todo deleted!", "success");
  } catch (err) {
    setStatus("failed to delete todo", "error");
  }
}

//logout script
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });
}

// ─── FORM SUBMIT ──────────────────────────────────────────
if (todoForm) {
  todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    addBtn.disabled = true;
    input.value = "";
    await addTodo(title);
    addBtn.disabled = false;
    input.focus();
  });
}
// ─── INIT ─────────────────────────────────────────────────
fetchTodos();
