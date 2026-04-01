import { useAuth } from "../context/AuthContext";

export default function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <header style={{
      height: "60px",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px",
      background: "rgba(15,17,23,0.8)",
      backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <h2 style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: "16px", fontWeight: 600,
        letterSpacing: "1px", color: "var(--text)",
        margin: 0,
      }}>
        {title}
      </h2>
    </header>
  );
}