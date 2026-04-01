// Reusable UI components — Cosmic/Login-matching design system

export const Card = ({ children, className = "", style = {} }) => (
  <div style={{
    background: "rgba(8,8,18,0.88)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
    ...style,
  }} className={`animate-fade-up ${className}`}>
    {children}
  </div>
);

export const StatCard = ({ title, value, icon, color = "#7c3aed", delay = "" }) => (
  <div className={`animate-fade-up ${delay}`} style={{
    background: "rgba(8,8,18,0.88)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
    cursor: "default",
  }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${color}22`;
      e.currentTarget.style.borderColor = `${color}40`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
    }}
  >
    {/* Glow accent line */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
    {/* Corner glow */}
    <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, pointerEvents: "none" }} />

    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px", marginBottom: "12px" }}>
          {title}
        </p>
        <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "38px", letterSpacing: "1px", color: "var(--text)", margin: 0, lineHeight: 1 }}>
          {value ?? "—"}
        </p>
      </div>
      {icon && (
        <div style={{
          width: "40px", height: "40px", borderRadius: "10px",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
          boxShadow: `0 0 16px ${color}20`,
        }}>
          {icon}
        </div>
      )}
    </div>
  </div>
);

export const Badge = ({ status }) => {
  const styles = {
    upcoming: { bg: "rgba(37,99,235,0.15)",  border: "rgba(37,99,235,0.3)",  color: "#60a5fa" },
    live:     { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399" },
    selling:  { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24" },
    closed:   { bg: "rgba(100,116,139,0.15)",border: "rgba(100,116,139,0.3)",color: "#94a3b8" },
    admin:    { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  color: "#f87171" },
    manager:  { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)", color: "#a78bfa" },
  };
  const s = styles[status] || styles.upcoming;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "20px",
      fontFamily: "sans-serif",
      fontSize: "9px", fontWeight: 500, letterSpacing: "1.5px",
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      {status?.toUpperCase()}
    </span>
  );
};

export const Table = ({ headers, children }) => (
  <div style={{
    background: "rgba(8,8,18,0.88)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px", overflow: "hidden",
    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
  }} className="animate-fade-up">
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {headers.map(h => (
            <th key={h} style={{
              padding: "14px 20px", textAlign: "left",
              fontFamily: "sans-serif",
              fontSize: "9px", fontWeight: 500,
              color: "rgba(255,255,255,0.3)", letterSpacing: "2px",
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const Tr = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    style={{
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      transition: "background 0.15s",
      cursor: onClick ? "pointer" : "default",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
  >
    {children}
  </tr>
);

export const Td = ({ children, muted = false, style = {} }) => (
  <td style={{
    padding: "14px 20px",
    fontSize: "13px",
    color: muted ? "rgba(255,255,255,0.35)" : "var(--text)",
    ...style,
  }}>
    {children}
  </td>
);

export const Btn = ({ children, onClick, variant = "primary", disabled = false, type = "button", style = {} }) => {
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb)",
      color: "white", border: "none",
      boxShadow: "0 4px 20px rgba(99,102,241,0.38)",
    },
    ghost: {
      background: "transparent",
      color: "rgba(255,255,255,0.4)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "none",
    },
    danger: {
      background: "rgba(239,68,68,0.1)",
      color: "#ef4444",
      border: "1px solid rgba(239,68,68,0.3)",
      boxShadow: "none",
    },
    success: {
      background: "rgba(16,185,129,0.1)",
      color: "#10b981",
      border: "1px solid rgba(16,185,129,0.3)",
      boxShadow: "none",
    },
  };
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 20px", borderRadius: "10px",
        fontFamily: "sans-serif",
        fontSize: "12px", fontWeight: 700, letterSpacing: "0.8px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.18s",
        ...v, ...style,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)"; if (variant === "primary") e.currentTarget.style.boxShadow = "0 10px 30px rgba(99,102,241,0.55)"; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; if (variant === "primary") e.currentTarget.style.boxShadow = v.boxShadow; }}
    >
      {children}
    </button>
  );
};

const glassInput = {
  width: "100%", padding: "12px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "#fff",
  fontFamily: " sans-serif", fontSize: "13px",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

export const Input = ({ label, ...props }) => (
  <div>
    {label && (
      <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "8px" }}>
        {label.toUpperCase()}
      </label>
    )}
    <input
      {...props}
      style={{ ...glassInput, ...props.style }}
      onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.08)"; }}
      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
    />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div>
    {label && (
      <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "8px" }}>
        {label.toUpperCase()}
      </label>
    )}
    <select
      {...props}
      style={{ ...glassInput, cursor: "pointer", ...props.style }}
    >
      {children}
    </select>
  </div>
);

export const Modal = ({ title, subtitle, onClose, children, footer }) => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: "20px",
  }} className="animate-fade-in">
    <div style={{
      position: "relative",
      width: "100%", maxWidth: "520px",
    }}>
      {/* Glowing halo */}
      <div style={{
        position: "absolute", inset: "-1px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.3), rgba(6,182,212,0.15))",
        filter: "blur(1px)",
        zIndex: -1,
        animation: "pulseGlow 3.5s ease infinite",
      }} />

      <div style={{
        background: "rgba(8,8,18,0.95)",
        backdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 90px rgba(0,0,0,0.65)",
      }} className="animate-fade-up">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div>
            {subtitle && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>{subtitle.toUpperCase()}</p>}
            <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", letterSpacing: "2px", color: "var(--text)", margin: 0 }}>
              {title}
            </h3>
          </div>
          <button onClick={onClose} style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.target.style.color = "#f87171"; e.target.style.borderColor = "rgba(239,68,68,0.3)"; e.target.style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.35)"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
          >×</button>
        </div>
        <div style={{ padding: "24px 28px" }}>{children}</div>
        {footer && (
          <div style={{ padding: "16px 28px 24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  </div>
);