import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/main.scss";

export default function AuthCard({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [fields, setFields] = useState({
    email: "",
    password: "",
    confirm: "",
    handle: "",
    displayName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  function onChange(e) {
    setFields((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!fields.email || !fields.password) {
          throw new Error("Please provide email & password");
        }
        await login({ email: fields.email, password: fields.password });
      } else {
        if (!fields.email || !fields.password || !fields.confirm) {
          throw new Error("Please fill required fields");
        }
        if (fields.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        if (fields.password !== fields.confirm) {
          throw new Error("Passwords do not match");
        }

        const handle =
          (fields.handle || fields.email.split("@")[0])
            .replace(/\s+/g, "")
            .toLowerCase();

        await register({
          email: fields.email,
          password: fields.password,
          handle,
          displayName: fields.displayName,
        });
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-card-inner">
        <div className="brand">
          <div className="brand-logo">Anonify</div>
        </div>

        <h2 className="auth-title">
          {mode === "login" ? "Welcome back." : "Create your account"}
        </h2>
        <p className="auth-sub">
          {mode === "login"
            ? "Login to continue."
            : "Join Anonify and post anonymously."}
        </p>

        <form className="auth-form" onSubmit={submit}>
          {mode === "register" && (
            <input
              className="input"
              name="handle"
              placeholder="Username (no spaces)"
              value={fields.handle}
              onChange={onChange}
            />
          )}
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            value={fields.email}
            onChange={onChange}
          />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={fields.password}
            onChange={onChange}
          />
          {mode === "register" && (
            <input
              className="input"
              name="confirm"
              type="password"
              placeholder="Confirm Password"
              value={fields.confirm}
              onChange={onChange}
            />
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              <span>Don't have an account?</span>
              <button
                className="switch-btn"
                type="button"
                onClick={() => setMode("register")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button
                className="switch-btn"
                type="button"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
