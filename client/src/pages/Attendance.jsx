import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { StatCard } from "../components/UI.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const glassPanel = {
  background: "rgba(8,8,18,0.88)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "18px",
  boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
};

const stars = Array.from({ length: 35 }, (_, i) => ({
  left:  `${((i * 137.508) % 100).toFixed(2)}%`,
  top:   `${((i * 97.303 + 11) % 100).toFixed(2)}%`,
  size:  i % 7 === 0 ? "2px" : "1px",
  opacity: 0.05 + ((i * 0.083) % 0.15),
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(8,8,18,0.95)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", padding: "12px 16px", fontSize: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
      <p style={{ fontFamily: "sans-serif", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontSize: "10px", letterSpacing: "1px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></p>
      ))}
    </div>
  );
};

const statusStyle = {
  upcoming: { bg: "rgba(37,99,235,0.15)",  border: "rgba(37,99,235,0.3)",  color: "#60a5fa" },
  live:     { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399" },
  selling:  { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24" },
  closed:   { bg: "rgba(100,116,139,0.15)",border: "rgba(100,116,139,0.3)",color: "#94a3b8" },
};

export default function Attendance() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/attendance")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#06060f", position: "relative" }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position: "fixed", borderRadius: "50%", background: "rgba(255,255,255,0.7)", width: s.size, height: s.size, left: s.left, top: s.top, opacity: s.opacity, pointerEvents: "none", zIndex: 0 }} />
      ))}
      <div style={{ position: "fixed", bottom: "10%", right: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <Navbar title="Attendance" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: "110px", borderRadius: "16px" }} />)}
              </div>
              <div className="skeleton" style={{ height: "320px", borderRadius: "16px" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <StatCard title="TOTAL ATTENDEES"   value={data?.totalAttendees}   icon="◎" color="#7c3aed" delay="delay-1" />
                <StatCard title="TOTAL CAPACITY"    value={data?.totalCapacity}    icon="◫" color="#60a5fa" delay="delay-2" />
                <StatCard title="OVERALL FILL RATE" value={data?.overallFillRate}  icon="◆" color="#10b981" delay="delay-3" />
              </div>

              {/* Chart */}
              <div className="animate-fade-up delay-2" style={{ ...glassPanel, padding: "28px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "8px" }}>VISUALIZATION</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: 0 ,fontWeight:"bold"}}>Attendees vs Capacity</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.events} barGap={3} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)", fontFamily:"sans-serif"}} axisLine={false} tickLine={false} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar dataKey="attendees" name="Attendees" fill="#7c3aed" radius={[6,6,0,0]} />
                    <Bar dataKey="capacity"  name="Capacity"  fill="rgba(255,255,255,0.06)" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: "20px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[{ label: "Attendees", color: "#7c3aed" }, { label: "Capacity", color: "rgba(255,255,255,0.1)", bordered: true }].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.color, border: l.bordered ? "1px solid rgba(255,255,255,0.15)" : "none" }} />
                      <span style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="animate-fade-up delay-3" style={{ ...glassPanel, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily:"sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>PER EVENT</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: 0 ,fontWeight:"bold"}}>Attendance Details</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Event","Date","Attendees","Capacity","Fill Rate","Status"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontFamily: "sans-serif", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.events?.map((ev, i) => {
                      const s = statusStyle[ev.status] || statusStyle.upcoming;
                      const fillNum = parseFloat(ev.fillRate);
                      const fillColor = fillNum >= 80 ? "#10b981" : fillNum >= 50 ? "#f59e0b" : "rgba(255,255,255,0.25)";
                      return (
                        <tr key={ev.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</td>
                          <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                          <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{ev.attendees?.toLocaleString()}</td>
                          <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{ev.capacity?.toLocaleString()}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "60px", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                                <div style={{ width: `${Math.min(fillNum || 0, 100)}%`, height: "100%", background: fillColor, borderRadius: "2px", boxShadow: `0 0 6px ${fillColor}80` }} />
                              </div>
                              <span style={{ fontFamily:"sans-serif", fontSize: "10px", color: fillColor, fontWeight: 600 }}>{ev.fillRate}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontFamily:"sans-serif", fontSize: "9px", fontWeight: 500, letterSpacing: "1px", background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{ev.status?.toUpperCase()}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}