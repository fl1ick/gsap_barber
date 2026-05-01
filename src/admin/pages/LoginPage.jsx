// src/admin/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email atau password salah.");
    } else {
      navigate("/admin");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "24px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "380px",
      }}>
        {/* Logo */}
        <div style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#e7d393", fontWeight: 700, letterSpacing: "2px", marginBottom: "0.4rem" }}>
          ✦ PRIME CUTS
        </div>
        <p style={{ color: "#555", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Admin Dashboard — Masuk untuk melanjutkan
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            padding: "0.65rem 1rem",
            color: "rgb(252,165,165)",
            fontSize: "0.82rem",
            marginBottom: "1rem",
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#888", fontWeight: 500, marginBottom: "0.4rem", display: "block", letterSpacing: "0.05em" }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@primecutss.com"
              required
              style={{
                width: "100%",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "10px",
                padding: "0.65rem 0.9rem",
                color: "#e8e8e8",
                fontSize: "0.88rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#888", fontWeight: 500, marginBottom: "0.4rem", display: "block", letterSpacing: "0.05em" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "10px",
                padding: "0.65rem 0.9rem",
                color: "#e8e8e8",
                fontSize: "0.88rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "12px",
              border: "none",
              background: loading ? "#a89a6a" : "#e7d393",
              color: "#0a0a0a",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;