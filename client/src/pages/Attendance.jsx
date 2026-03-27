import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { StatCard } from "../components/UI.jsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
      <p style={{ color: "var(--muted)", marginBottom: "6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></p>
      ))}
    </div>
  );
};

const statusStyle = {
  upcoming: { bg: "rgba(37,99,235,0.15)",  border: "rgba(37,99,235,0.3)",  color: "#60a5fa"  },
  live:     { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399"  },
  selling:  { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24"  },
  closed:   { bg: "rgba(100,116,139,0.15)",border: "rgba(100,116,139,0.3)",color: "#94a3b8"  },
};

export default function Attendance() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/attendance")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Attendance" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: "100px", borderRadius: "14px" }} />)}
              </div>
              <div className="skeleton" style={{ height: "300px", borderRadius: "14px" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <StatCard title="TOTAL ATTENDEES"   value={data?.totalAttendees}   icon="◎" color="#2563eb" delay="delay-1" />
                <StatCard title="TOTAL CAPACITY"    value={data?.totalCapacity}    icon="◫" color="#64748b" delay="delay-2" />
                <StatCard title="OVERALL FILL RATE" value={data?.overallFillRate}  icon="◆" color="#10b981" delay="delay-3" />
              </div>

              {/* Chart */}
              <div className="animate-fade-up delay-2" style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "24px",
              }}>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600 }}>VISUALIZATION</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginTop: "4px" }}>Attendees vs Capacity</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.events} barGap={3} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3d" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="attendees" name="Attendees" fill="#2563eb"  radius={[6,6,0,0]} />
                    <Bar dataKey="capacity"  name="Capacity"  fill="#2a2d3d" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: "20px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                  {[{ label: "Attendees", color: "#2563eb" }, { label: "Capacity", color: "#2a2d3d", bordered: true }].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.color, border: l.bordered ? "1px solid var(--border)" : "none" }} />
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="animate-fade-up delay-3" style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "16px", overflow: "hidden",
              }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600 }}>PER EVENT</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginTop: "2px" }}>Attendance Details</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                      {["Event","Date","Attendees","Capacity","Fill Rate","Status"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1.5px", fontFamily: "'Sora', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.events?.map((ev, i) => {
                      const s = statusStyle[ev.status] || statusStyle.upcoming;
                      const fillNum = parseFloat(ev.fillRate);
                      const fillColor = fillNum >= 80 ? "#10b981" : fillNum >= 50 ? "#f59e0b" : "var(--muted)";
                      return (
                        <tr key={ev.id} style={{ borderBottom: "1px solid var(--border)", animationDelay: `${i * 0.04}s` }} className="animate-fade-up"
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{ev.attendees?.toLocaleString()}</td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{ev.capacity?.toLocaleString()}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "56px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                                <div style={{ width: `${Math.min(fillNum || 0, 100)}%`, height: "100%", background: fillColor, borderRadius: "2px" }} />
                              </div>
                              <span style={{ fontSize: "12px", color: fillColor, fontWeight: 600 }}>{ev.fillRate}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: "'Sora', sans-serif" }}>{ev.status?.toUpperCase()}</span>
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