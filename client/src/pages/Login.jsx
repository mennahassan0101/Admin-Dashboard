import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Card, StatCard, Badge, Table, Tr, Td, Btn, Modal, Input, Select } from "../components/UI.jsx";

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/Users/login", { email, password });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "admin" ? "/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text)",
    fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
    outline: "none", transition: "border-color 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.06) 0%, transparent 50%)",
    }}>
      <div className="animate-fade-up" style={{
        width: "100%", maxWidth: "420px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "22px", fontWeight: 700,
            letterSpacing: "2px",
            background: "linear-gradient(135deg, #2563eb, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "6px",
          }}>
            EVENTCORE
          </div>
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
            Sign in to your dashboard
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", padding: "12px 16px",
            borderRadius: "10px", fontSize: "13px",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: "8px" }}>
              EMAIL
            </label>
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: "8px" }}>
              PASSWORD
            </label>
            <input
              type="password" required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "var(--surface2)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              border: "none", borderRadius: "10px",
              color: "white", fontSize: "14px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              boxShadow: loading ? "none" : "0 4px 15px rgba(37,99,235,0.3)",
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}