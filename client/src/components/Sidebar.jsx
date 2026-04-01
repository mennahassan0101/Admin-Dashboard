import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard",  label: "Dashboard",  icon: "⬡", roles: ["admin","manager"] },
  { to: "/events",     label: "Events",      icon: "◈", roles: ["admin","manager"] },
  { to: "/attendance", label: "Attendance",  icon: "◎", roles: ["admin","manager"] },
  { to: "/analytics",  label: "Analytics",   icon: "◫", roles: ["admin","manager"] },
  { to: "/revenue",    label: "Revenue",     icon: "◆", roles: ["admin"]           },
  { to: "/users",      label: "Users",       icon: "◐", roles: ["admin"]           },
];

const stars = Array.from({ length: 18 }, (_, i) => ({
  left:  `${((i * 137.508) % 100).toFixed(2)}%`,
  top:   `${((i * 97.303 + 11) % 100).toFixed(2)}%`,
  size:  i % 5 === 0 ? "2px" : "1px",
  opacity: 0.08 + ((i * 0.07) % 0.2),
}));

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };

  const [hoveredLink, setHoveredLink] = useState(null);
  const [userCardHovered, setUserCardHovered] = useState(false);

  return (
    <aside style={{
      width: "240px", minHeight: "100vh",
      background: "rgba(6,6,15,0.96)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh",
      overflow: "hidden",
    }}>
      {/* Stars */}
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          background: "rgba(255,255,255,0.6)",
          width: s.size, height: s.size,
          left: s.left, top: s.top, opacity: s.opacity,
          pointerEvents: "none",
        }} />
      ))}

      {/* Nebula glow */}
      <div style={{ position: "absolute", top: "-40px", left: "-40px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
        <Link to="/dashboard" style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            fontFamily: "sans-serif",
            fontSize: "24px", letterSpacing: "4px",
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 12px rgba(139,92,246,0.4))",
            transition: "filter 0.3s ease",
            fontWeight:"bold"
          }}
            onMouseEnter={e => e.currentTarget.style.filter = "drop-shadow(0 0 20px rgba(139,92,246,0.7))"}
            onMouseLeave={e => e.currentTarget.style.filter = "drop-shadow(0 0 12px rgba(139,92,246,0.4))"}
          >
            EVENTCORE
          </div>
          <div style={{ fontFamily: "sans-serif", fontSize: "9px", letterSpacing: "2.5px", color: "rgba(167,139,250,0.5)", marginTop: "4px" }}>
            ADMIN PLATFORM
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1, position: "relative" }}>
        <div style={{ fontFamily: "sans-serif", fontSize: "8px", letterSpacing: "3px", color: "rgba(255,255,255,0.2)", padding: "8px 10px", marginBottom: "4px" }}>
          NAVIGATION
        </div>
        {links
          .filter(l => l.roles.includes(user?.role))
          .map((link, i) => {
            const isHovered = hoveredLink === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHoveredLink(link.to)}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "10px",
                  marginBottom: "1px", textDecoration: "none",
                  fontSize: "13px", fontWeight: (isActive || isHovered) ? 700 : 500,
                  letterSpacing: "0.3px", transition: "all 0.2s",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.15))"
                    : isHovered
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                  color: isActive ? "#a78bfa" : isHovered ? "#ffffff" : "rgba(255,255,255,0.4)",
                  border: isActive
                    ? "1px solid rgba(139,92,246,0.3)"
                    : isHovered
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid transparent",
                  boxShadow: isActive
                    ? "0 0 20px rgba(124,58,237,0.15), inset 0 0 12px rgba(124,58,237,0.05)"
                    : "none",
                  animationDelay: `${i * 0.05}s`,
                })}
                className="animate-fade-up"
              >
                <span style={{ fontSize: "15px", width: "20px", textAlign: "center" }}>{link.icon}</span>
                {link.label}
              </NavLink>
            );
          })}
      </nav>

      {/* User section */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 12px", position: "relative" }}>
        <div
          onMouseEnter={() => setUserCardHovered(true)}
          onMouseLeave={() => setUserCardHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px",
            background: userCardHovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
            border: userCardHovered ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px", marginBottom: "8px",
            transition: "all 0.2s", cursor: "default",
          }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "white", flexShrink: 0,
            boxShadow: "0 0 14px rgba(124,58,237,0.4)",
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: userCardHovered ? "#ffffff" : "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.2s" }}>
              {user?.name}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "1.5px", color: "rgba(167,139,250,0.7)" }}>
              {user?.role?.toUpperCase()}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "9px 12px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px", color: "rgba(255,255,255,0.3)",
            fontSize: "12px", cursor: "pointer",
            transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={e => { e.target.style.color = "#f87171"; e.target.style.borderColor = "rgba(239,68,68,0.3)"; e.target.style.background = "rgba(239,68,68,0.06)"; }}
          onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.3)"; e.target.style.borderColor = "rgba(255,255,255,0.06)"; e.target.style.background = "transparent"; }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}