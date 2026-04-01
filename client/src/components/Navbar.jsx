import { useAuth } from "../context/AuthContext";

export default function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <header style={{
      height: "60px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px",
      background: "rgba(6,6,15,0.85)",
      backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Glow dot */}
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6", animation: "pulseGlow 2s ease infinite", boxShadow: "0 0 8px rgba(139,92,246,0.8)" }} />
        <h2 style={{
          fontFamily:"inherit",
          fontSize: "20px", fontWeight: "bold",
          letterSpacing: "4px", color: "rgba(255,255,255,0.85)",
          textShadow: "0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(37, 99, 235, 0.3)",
          margin: 0,
        }}>
          {title?.toUpperCase()}
        </h2>
      </div>

      {/* Right side — user pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "5px 14px", borderRadius: "100px",
        background: "rgba(139,92,246,0.08)",
        border: "1px solid rgba(139,92,246,0.2)",
      }}>
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "10px", fontWeight: 700, color: "white",
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontFamily: "sans-serif", fontSize: "10px", letterSpacing: "1px", color: "rgba(167,139,250,0.8)" }}>
          {user?.role?.toUpperCase()}
        </span>
      </div>
    </header>
  );
}