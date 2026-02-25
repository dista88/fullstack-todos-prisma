import React from "react";
import { useState } from "react";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ msg: "", type: "" });

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isLogin && password !== confirm) {
      return setStatus({ msg: "Passwords do not match", type: "error" });
    }

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return setStatus({
          msg: data.message || "Something went wrong",
          type: "error",
        });
      }
      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setStatus({ msg: "Registered! Please login.", type: "success" });
        setIsLogin(true);
      }
    } catch (err) {
      setStatus({ msg: "Something went wrong", type: "error" });
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div
          id="auth-status"
          className={status.type ? `${status.type}` : ""}
          style={{ display: status.msg ? "block" : "none" }}
        >
          {status.msg}
        </div>

        <form className="auth-form active" onSubmit={handleSubmit}>
          <h2>{isLogin ? "LOGIN" : "REGISTER"}</h2>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          )}

          <button type="submit">{isLogin ? "LOGIN" : "REGISTER"}</button>
        </form>

        <p className="toggle-link">
          {isLogin ? "No account? " : "Have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
