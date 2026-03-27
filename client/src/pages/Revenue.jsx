import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const GREEN_SHADES = ["#10b981","#059669","#34d399","#6ee7b7","#0d9488","#14b8a6","#047857","#065f46"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
      <p style={{ color: "var(--muted)", marginBottom: "6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: "#10b981", margin: "2px 0" }}>{p.name}: <strong>${p.value?.toLocaleString()}</strong></p>
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

export default function Revenue() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/revenue")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const topEvent = data?.events?.reduce((a, b) => (a.revenue > b.revenue ? a : b), {});

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Revenue" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="skeleton" style={{ height: "120px", borderRadius: "14px" }} />
              <div className="skeleton" style={{ height: "300px", borderRadius: "14px" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Hero Revenue Card */}
              <div className="animate-fade-up" style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "32px",
                position: "relative", overflow: "hidden",
              }}>
                {/* Glow bg */}
                <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", background: "rgba(16,185,129,0.08)", borderRadius: "50%", filter: "blur(40px)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #10b981, #059669)" }} />
                <div style={{ position: "relative" }}>
                  <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600, marginBottom: "8px" }}>TOTAL PLATFORM REVENUE</p>
                  <p style={{ fontSize: "48px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#10b981", margin: 0, lineHeight: 1 }}>
                    ${Number(data?.totalRevenue).toLocaleString()}
                  </p>
                  {topEvent?.name && (
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px" }}>
                      Top performer: <span style={{ color: "#34d399", fontWeight: 600 }}>{topEvent.name}</span> — ${Number(topEvent.revenue).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="animate-fade-up delay-2" style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "16px", padding: "24px",
              }}>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600 }}>BREAKDOWN</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginTop: "4px" }}>Revenue per Event</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.events} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3d" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" radius={[6,6,0,0]}>
                      {data?.events?.map((_, i) => <Cell key={i} fill={GREEN_SHADES[i % GREEN_SHADES.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="animate-fade-up delay-3" style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "16px", overflow: "hidden",
              }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600 }}>PER EVENT</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginTop: "2px" }}>Revenue Details</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                      {["Event","Date","Attendees","Ticket Price","Revenue","Status"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1.5px", fontFamily: "'Sora', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.events?.map((ev, i) => {
                      const s = statusStyle[ev.status] || statusStyle.upcoming;
                      const isTop = ev.id === topEvent?.id;
                      return (
                        <tr key={ev.id} style={{ borderBottom: "1px solid var(--border)", animationDelay: `${i * 0.04}s` }} className="animate-fade-up"
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</span>
                              {isTop && <span style={{ fontSize: "9px", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.5px" }}>TOP</span>}
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{ev.attendees?.toLocaleString()}</td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>${ev.ticketPrice}</td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: "#10b981", fontWeight: 700 }}>${Number(ev.revenue).toLocaleString()}</td>
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