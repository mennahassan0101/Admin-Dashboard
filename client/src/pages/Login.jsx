import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

function Particle({ style }) {
  return (
    <div style={{
      position: "absolute",
      width: "2px", height: "2px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.55)",
      pointerEvents: "none",
      ...style,
    }} />
  );
}

function FloatCard({ icon, glowColor, style, delay = "0s" }) {
  return (
    <div style={{
      position: "absolute",
      width: "88px", height: "88px",
      borderRadius: "20px",
      background: "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "26px", color: "rgba(255,255,255,0.7)",
      boxShadow: `0 0 32px 10px ${glowColor}, inset 0 0 16px rgba(255,255,255,0.03)`,
      animation: "floatCard 4s ease-in-out infinite",
      animationDelay: delay,
      ...style,
    }}>
      {icon}
    </div>
  );
}

export default function Login() {
  const [email,   setEmail]   = useState("");
  const [password,setPassword]= useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Deterministic star field — stable across renders
  const stars = Array.from({ length: 65 }, (_, i) => ({
    left:  `${((i * 137.508) % 100).toFixed(2)}%`,
    top:   `${((i * 97.303 + 11) % 100).toFixed(2)}%`,
    size:  i % 7 === 0 ? "3px" : "2px",
    opacity: 0.15 + ((i * 0.083) % 0.45),
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;700&display=swap');

        @keyframes floatCard {
          0%, 100% { transform: translateY(0px)   rotate(var(--rot, -8deg)); }
          50%       { transform: translateY(-16px) rotate(var(--rot, -8deg)); }
        }
        @keyframes loginUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1;    }
        }
        @keyframes heroLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0);     }
        }

        .lc-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .lc-input::placeholder { color: rgba(255,255,255,0.2); }
        .lc-input:focus {
          border-color: rgba(139,92,246,0.7) !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.08) !important;
        }

        .lc-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb);
          border: none; border-radius: 11px; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1px;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 22px rgba(99,102,241,0.38);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .lc-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(99,102,241,0.55);
        }
        .lc-btn:disabled {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.25);
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 900px) {
          .lc-hero { display: none !important; }
          .lc-float-cards { display: none !important; }
          .lc-card-wrap { margin: auto !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#06060f",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Star field ───────────────────────── */}
        {stars.map((s, i) => (
          <Particle key={i} style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.opacity }} />
        ))}

        {/* ── Background nebula glows ──────────── */}
        <div style={{ position: "absolute", top: "-15%", left: "-8%", width: "550px", height: "550px", background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-8%", width: "650px", height: "650px", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "35%", right: "30%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        {/* ── Floating decorative cards ─────────── */}
        <div className="lc-float-cards">
          <FloatCard 
              icon="◈" 
              glowColor="rgba(109,40,217,0.4)"  
              style={{ left: "22%", top: "12%", "--rot": "-12deg" }} 
              delay="0s"   
            />
            
            {/* Was 15%, changed to 28% */}
            <FloatCard 
              icon="◆" 
              glowColor="rgba(37,99,235,0.4)"   
              style={{ left: "28%", top: "45%", "--rot": "7deg", width: "102px", height: "102px" }} 
              delay="1.4s"  
            />
            
            {/* Was 40%, changed to 48% */}
            <FloatCard 
              icon="◎" 
              glowColor="rgba(6,182,212,0.35)"  
              style={{ left: "48%", bottom: "18%", "--rot": "-4deg", width: "76px", height: "76px" }} 
              delay="0.7s"  
            />
        </div>

        {/* ── Hero left text ───────────────────── */}
        <div className="lc-hero" style={{
          position: "absolute",
          left: "5%", top: "30%", transform: "translateY(-50%)",
          maxWidth: "360px",
          animation: "heroLeft 0.8s ease both 0.1s",
          zIndex: 5,
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "5px 14px", borderRadius: "100px",
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.2)",
            marginBottom: "28px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6", animation: "pulseGlow 2s ease infinite" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "2.5px", color: "rgba(167,139,250,0.9)" }}>ADMIN PLATFORM</span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "clamp(48px, 5.5vw, 76px)",
            letterSpacing: "3px", lineHeight: 1.05,
            color: "#fff", margin: "0 0 20px",
           }}>
            MANAGE<br />
            <span style={{
              background: "linear-gradient(135deg, #a78bfa, #60a5fa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              EVENTS
            </span>
            <br />BEYOND LIMITS
          </h1>

          {/* <p style={{
            color: "rgba(255,255,255,0.28)",
            fontSize: "12px", lineHeight: 1.8,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.4px", margin: 0,
          }}>
            Full-stack analytics, revenue<br />tracking & team management.
          </p> */}
        </div>

        {/* ── Login card ───────────────────────── */}
        <div
          className="lc-card-wrap"
          style={{
            position: "relative",
            marginLeft: "auto",
            marginRight: "7%",
            width: "100%",
            maxWidth: "420px",
            animation: "loginUp 0.6s ease both 0.2s",
            zIndex: 10,
            padding: "0 16px",
          }}
        >
          {/* Glowing border halo */}
          <div style={{
            position: "absolute", inset: "-1px",
            borderRadius: "22px",
            background: "linear-gradient(135deg, rgba(139,92,246,0.45), rgba(59,130,246,0.35), rgba(6,182,212,0.2))",
            filter: "blur(1px)",
            zIndex: -1,
            animation: "pulseGlow 3.5s ease infinite",
          }} />

          <div style={{
            background: "rgba(8,8,18,0.88)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "22px",
            padding: "44px 40px",
            boxShadow: "0 32px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>

            {/* Logo */}
            <div style={{ marginBottom: "36px", textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "54px", height: "54px", borderRadius: "15px",
                background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.15))",
                border: "1px solid rgba(139,92,246,0.25)",
                fontSize: "22px", marginBottom: "18px",
                boxShadow: "0 0 24px rgba(139,92,246,0.2)",
              }}>◈</div>

              <div style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: "30px", letterSpacing: "5px",
                color: "#fff", lineHeight: 1, marginBottom: "8px",
              }}>
                EVENTCORE
              </div>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "9px", letterSpacing: "2px",
                color: "rgba(255,255,255,0.25)", margin: 0,
              }}>
                SIGN IN TO CONTINUE
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.22)",
                color: "#f87171",
                padding: "11px 14px", borderRadius: "10px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "11px", letterSpacing: "0.4px",
                marginBottom: "20px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "9px", letterSpacing: "2px",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase", marginBottom: "8px",
                }}>
                  Email Address
                </label>
                <input
                  className="lc-input"
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{
                  display: "block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "9px", letterSpacing: "2px",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase", marginBottom: "8px",
                }}>
                  Password
                </label>
                <input
                  className="lc-input"
                  type="password" required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button className="lc-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.15)", borderTopColor: "rgba(255,255,255,0.6)", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    SIGNING IN...
                  </>
                ) : "SIGN IN →"}
              </button>
            </form>

            <p style={{
              textAlign: "center",
              fontFamily: "'DM Mono', monospace",
              fontSize: "9px", letterSpacing: "1.5px",
              color: "rgba(255,255,255,0.12)",
              marginTop: "26px", marginBottom: 0,
            }}>
              SECURED · EVENTCORE ADMIN 
            </p>
          </div>
        </div>

      </div>
    </>
  );
}