import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const links = [
  { to: "/dashboard",  label: "Dashboard",  icon: "⬡", roles: ["admin","manager"] },
  { to: "/events",     label: "Events",      icon: "◈", roles: ["admin","manager"] },
  { to: "/attendance", label: "Attendance",  icon: "◎", roles: ["admin","manager"] },
  { to: "/analytics",  label: "Analytics",   icon: "◫", roles: ["admin","manager"] },
  { to: "/revenue",    label: "Revenue",     icon: "◆", roles: ["admin"]           },
  { to: "/users",      label: "Users",       icon: "◐", roles: ["admin"]           },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside style={{
      width: "240px", minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh",
    }}>
    {/* Logo */}
    <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid var(--border)" }}>
      <Link to="/dashboard" style={{ textDecoration: "none", display: "block", cursor: "pointer" }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "20px", 
          fontWeight: 700,
          letterSpacing: "2px",
          background: "linear-gradient(135deg, #2563eb, #10b981)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          EVENTCORE
        </div>
        <div style={{ 
          fontSize: "11px", 
          color: "var(--muted)", 
          marginTop: "4px", 
          letterSpacing: "1px",
          fontWeight: 500 
        }}>
          ADMIN PLATFORM
        </div>
      </Link>
    </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "var(--muted)", padding: "8px 12px", marginBottom: "4px" }}>
          NAVIGATION
        </div>
        {links
          .filter(l => l.roles.includes(user?.role))
          .map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "8px",
                marginBottom: "2px", textDecoration: "none",
                fontSize: "13px", fontWeight: 500,
                transition: "all 0.15s",
                background: isActive ? "rgba(37,99,235,0.15)" : "transparent",
                color: isActive ? "#2563eb" : "var(--muted)",
                border: isActive ? "1px solid rgba(37,99,235,0.3)" : "1px solid transparent",
                animationDelay: `${i * 0.05}s`,
              })}
              className="animate-fade-up"
            >
              <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
      </nav>

      {/* User */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", background: "var(--surface2)",
          borderRadius: "10px", marginBottom: "8px",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "white",
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: "10px", color: "#2563eb", letterSpacing: "1px", fontFamily: "'Sora', sans-serif" }}>
              {user?.role?.toUpperCase()}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "8px 12px",
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: "8px", color: "var(--muted)",
            fontSize: "12px", cursor: "pointer",
            transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => { e.target.style.color = "#ef4444"; e.target.style.borderColor = "#ef4444"; e.target.style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={e => { e.target.style.color = "var(--muted)"; e.target.style.borderColor = "var(--border)"; e.target.style.background = "transparent"; }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}