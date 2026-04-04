import React, { useState } from "react";
import axios from "axios";
import { Lock } from "lucide-react";
import { API_URL } from "../../config/api";

const Login = ({ setToken }) => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        mode === "setup"
          ? `${API_URL}/api/auth/setup`
          : `${API_URL}/api/auth/login`;
      const res = await axios.post(endpoint, { username, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
    } catch (err) {
      const message = err.response?.data?.msg;
      const isNetworkError = !err.response;
      setError(
        message ||
          (isNetworkError
            ? "Unable to reach the admin server. Check your API URL or network connection."
            : null) ||
          (mode === "setup"
            ? "Unable to create admin account"
            : "Invalid credentials"),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-secondary p-8 rounded-xl border border-slate-700 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent">
            <Lock size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {mode === "setup" ? "Create Admin Account" : "Admin Login"}
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          {mode === "setup"
            ? "Use this once to create the first admin user for local management."
            : "Sign in to add, edit, and remove portfolio projects."}
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-2">Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary mt-4">
            {mode === "setup" ? "Create Admin Account" : "Login"}
          </button>

          <button
            type="button"
            onClick={() => {
              setError("");
              setMode(mode === "setup" ? "login" : "setup");
            }}
            className="w-full mt-2 text-sm text-accent hover:underline"
          >
            {mode === "setup"
              ? "Back to login"
              : "First time here? Create admin account"}
          </button>

          <div className="text-center mt-4">
            <a href="/" className="text-accent text-sm hover:underline">
              Back to Website
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
