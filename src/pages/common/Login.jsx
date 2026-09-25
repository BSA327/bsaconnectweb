import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/api";
import { saveAuth } from "../../auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await loginApi(form);
      const token = data;
      if (!token) throw new Error("Token not returned by API.");
      saveAuth(token, data.user || data);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
         <div className="login-brand">
          <img src="/bsa-logo.png" alt="BSA Logo" />
        </div>
        <h1>BSA Connect</h1>
        <p>One workspace for all</p>
        {/* <div className="login-points">
          <span>✓ Attendance & field tracking</span>
          <span>✓ Customer & enquiry management</span>
          <span>✓ Inventory & site visits</span>
        </div> */}
      </div>
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h2>Sign in</h2>
        <p>Use your BSA Connect account.</p>
        {error && <div className="alert error">{error}</div>}
        <label>Username<input required value={form.username} onChange={e => setForm({...form, username:e.target.value})} /></label>
        <label>Password<input required type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} /></label>
        <button className="btn primary full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
      </form>
    </div>
  );
}