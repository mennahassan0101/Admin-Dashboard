import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const GREEN_SHADES = ["#10b981","#059669","#34d399","#6ee7b7","#0d9488","#14b8a6","#047857","#065f46"];

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
    <div style={{ background: "rgba(8,8,18,0.95)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "12px 16px", fontSize: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
      <p style={{ fontFamily: "sans-serif", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontSize: "10px", letterSpacing: "1px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: "#34d399", margin: "2px 0" }}>{p.name}: <strong>${p.value?.toLocaleString()}</strong></p>
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

export default function Revenue() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/revenue")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const topEvent = data?.events?.reduce((a, b) => (a.revenue > b.revenue ? a : b), {});

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#06060f", position: "relative" }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position: "fixed", borderRadius: "50%", background: "rgba(255,255,255,0.7)", width: s.size, height: s.size, left: s.left, top: s.top, opacity: s.opacity, pointerEvents: "none", zIndex: 0 }} />
      ))}
      <div style={{ position: "fixed", top: "20%", left: "30%", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <Navbar title="Revenue" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="skeleton" style={{ height: "140px", borderRadius: "16px" }} />
              <div className="skeleton" style={{ height: "320px", borderRadius: "16px" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Hero Revenue Card */}
              <div className="animate-fade-up" style={{
                ...glassPanel, padding: "36px",
                position: "relative", overflow: "hidden",
              }}>
                {/* Green glow bg */}
                <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                {/* Top green bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #10b981, #059669, transparent)" }} />

                <div style={{ position: "relative" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "3px", marginBottom: "12px" }}>TOTAL PLATFORM REVENUE</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: "60px", letterSpacing: "2px", color: "#10b981", margin: 0, lineHeight: 1, textShadow: "0 0 40px rgba(16,185,129,0.4)" }}>
                    ${Number(data?.totalRevenue).toLocaleString()}
                  </p>
                  {topEvent?.name && (
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "14px", letterSpacing: "0.5px" }}>
                      Top performer: <span style={{ color: "#34d399", fontWeight: 600 }}>{topEvent.name}</span> — ${Number(topEvent.revenue).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="animate-fade-up delay-2" style={{ ...glassPanel, padding: "28px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "8px" }}>BREAKDOWN</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: 0 ,fontWeight:"bold",textShadow: "2px 2px 4px rgba(231, 224, 237, 0.5)"}}>Revenue per Event</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.events} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" radius={[6,6,0,0]}>
                      {data?.events?.map((_, i) => <Cell key={i} fill={GREEN_SHADES[i % GREEN_SHADES.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="animate-fade-up delay-3" style={{ ...glassPanel, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily:"sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>PER EVENT</p>
                  <p style={{ fontFamily:"sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: 0 }}>Revenue Details</p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Event","Date","Attendees","Ticket Price","Revenue","Status"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontFamily:"sans-serif", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.events?.map((ev, i) => {
                      const s = statusStyle[ev.status] || statusStyle.upcoming;
                      const isTop = ev.id === topEvent?.id;
                      return (
                        <tr key={ev.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</span>
                              {isTop && <span style={{ fontFamily: "sans-serif", fontSize: "8px", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", padding: "2px 7px", borderRadius: "4px", letterSpacing: "1px" }}>TOP</span>}
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                          <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{ev.attendees?.toLocaleString()}</td>
                          <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>${ev.ticketPrice}</td>
                          <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "12px", color: "#34d399", fontWeight: 600, textShadow: "0 0 10px rgba(52,211,153,0.3)" }}>${Number(ev.revenue).toLocaleString()}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 500, letterSpacing: "1px", background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{ev.status?.toUpperCase()}</span>
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