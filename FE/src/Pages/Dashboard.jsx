import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [logs, setLogs] = useState([]);

  function logRequest(method, path, statusCode) {
    setLogs((prev) => [{ method, path, statusCode, id: Date.now() }, ...prev]);
  }

  function setStatusMsg(msg, type) {
    setStatus({ msg, type });
    setTimeout(() => setStatus({ msg: "", type: "" }), 2500);
  }

  useEffect(() => {
    getTodos(logRequest).then(setTodos);
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setStatusMsg("adding...", "loading");
    const newTodo = await createTodo(input, logRequest);
    setTodos([newTodo, ...todos]);
    setInput("");
    setStatusMsg("todo added!", "success");
  }

  async function handleComplete(todo) {
    setStatusMsg("updating...", "loading");
    const updated = await updateTodo(todo.id, !todo.completed, logRequest);
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    setStatusMsg("todo updated!", "success");
  }

  async function handleDelete(id) {
    setStatusMsg("deleting...", "loading");
    await deleteTodo(id, logRequest);
    setTodos(todos.filter((t) => t.id !== id));
    setStatusMsg("todo deleted!", "success");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <header>
          <div>
            <h1>TODOS</h1>
          </div>
          <button id="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div id="status" className={status.type}>
          {status.msg}
        </div>

        <form className="input-row" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="what needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="add-btn" type="submit">
            + ADD
          </button>
        </form>

        <p className="section-label">Tasks</p>
        <ul id="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? "done" : ""}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleComplete(todo)}
              />
              <span className="todo-text">{todo.title}</span>
              <span className="todo-id">#{String(todo.id).slice(-4)}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && (
          <div id="empty-state" style={{ display: "block" }}>
            no todos yet. add one above.
          </div>
        )}

        <div id="log">
          <p className="section-label" style={{ marginBottom: "12px" }}>
            Network Requests
          </p>
          <ul id="log-list">
            {logs.map((log) => (
              <li key={log.id} className="log-entry">
                <span className={`method ${log.method}`}>{log.method}</span>
                <span className="log-url">{log.path}</span>
                <span className="log-status">{log.statusCode}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
