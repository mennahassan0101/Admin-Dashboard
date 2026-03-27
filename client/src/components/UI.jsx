// Reusable UI components with the new design system

export const Card = ({ children, className = "", style = {} }) => (
  <div style={{
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "24px",
    ...style,
  }} className={`animate-fade-up ${className}`}>
    {children}
  </div>
);

export const StatCard = ({ title, value, icon, color = "#2563eb", delay = "" }) => (
  <div className={`animate-fade-up ${delay}`} style={{
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
  >
    {/* Top accent line */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: color }} />

    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1.5px", marginBottom: "10px" }}>
          {title}
        </p>
        <p style={{ fontSize: "32px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", margin: 0, lineHeight: 1 }}>
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
    manager:  { bg: "rgba(37,99,235,0.15)",  border: "rgba(37,99,235,0.3)",  color: "#60a5fa" },
  };
  const s = styles[status] || styles.upcoming;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "10px", fontWeight: 600,
      letterSpacing: "0.5px",
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontFamily: "'Sora', sans-serif",
    }}>
      {status?.toUpperCase()}
    </span>
  );
};

export const Table = ({ headers, children, loading }) => (
  <div style={{
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "14px", overflow: "hidden",
  }} className="animate-fade-up">
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
          {headers.map(h => (
            <th key={h} style={{
              padding: "14px 20px", textAlign: "left",
              fontSize: "10px", fontWeight: 600,
              color: "var(--muted)", letterSpacing: "1.5px",
              fontFamily: "'Sora', sans-serif",
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
    {loading && (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", fontSize: "13px" }}>
        Loading...
      </div>
    )}
  </div>
);

export const Tr = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    style={{
      borderBottom: "1px solid var(--border)",
      transition: "background 0.1s",
      cursor: onClick ? "pointer" : "default",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
  >
    {children}
  </tr>
);

export const Td = ({ children, muted = false, style = {} }) => (
  <td style={{
    padding: "14px 20px",
    fontSize: "13px",
    color: muted ? "var(--muted)" : "var(--text)",
    ...style,
  }}>
    {children}
  </td>
);

export const Btn = ({ children, onClick, variant = "primary", disabled = false, type = "button", style = {} }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", border: "none", shadow: "0 4px 15px rgba(37,99,235,0.3)" },
    ghost:   { background: "transparent", color: "var(--muted)", border: "1px solid var(--border)", shadow: "none" },
    danger:  { background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", shadow: "none" },
    success: { background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", shadow: "none" },
  };
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 18px", borderRadius: "8px",
        fontSize: "12px", fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        letterSpacing: "0.3px",
        boxShadow: v.shadow,
        ...v, ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, ...props }) => (
  <div>
    {label && (
      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: "8px" }}>
        {label}
      </label>
    )}
    <input
      {...props}
      style={{
        width: "100%", padding: "11px 14px",
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: "8px", color: "var(--text)",
        fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
        outline: "none", transition: "border-color 0.15s",
        ...props.style,
      }}
      onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
      onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
    />
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div>
    {label && (
      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: "8px" }}>
        {label}
      </label>
    )}
    <select
      {...props}
      style={{
        width: "100%", padding: "11px 14px",
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: "8px", color: "var(--text)",
        fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
        outline: "none", cursor: "pointer",
        ...props.style,
      }}
    >
      {children}
    </select>
  </div>
);

export const Modal = ({ title, onClose, children, footer }) => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: "20px",
  }} className="animate-fade-in">
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "18px",
      width: "100%", maxWidth: "520px",
      maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    }} className="animate-fade-up">
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 28px", borderBottom: "1px solid var(--border)",
      }}>
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--text)", margin: 0 }}>
          {title}
        </h3>
        <button onClick={onClose} style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "var(--surface2)", border: "1px solid var(--border)",
          color: "var(--muted)", cursor: "pointer", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.target.style.color = "var(--text)"; }}
          onMouseLeave={e => { e.target.style.color = "var(--muted)"; }}
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
);