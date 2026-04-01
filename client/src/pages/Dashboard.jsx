import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { StatCard } from "../components/UI.jsx";

const COLORS = ["#ef4444", "#10b981", "#f59e0b", "#7c3aed"];

const statusStyle = {
  upcoming: { bg: "rgba(37,99,235,0.15)",  border: "rgba(37,99,235,0.3)",  color: "#60a5fa"  },
  live:     { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399"  },
  selling:  { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24"  },
  closed:   { bg: "rgba(100,116,139,0.15)",border: "rgba(100,116,139,0.3)",color: "#94a3b8"  },
};

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(8,8,18,0.95)", border: "1px solid rgba(139,92,246,0.3)",
      borderRadius: "10px", padding: "12px 16px", fontSize: "12px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.1)",
    }}>
      <p style={{ fontFamily: "sans-serif", color: "rgba(255,255,255,0.4)", marginBottom: "6px", fontSize: "10px", letterSpacing: "1px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// Background stars
const stars = Array.from({ length: 40 }, (_, i) => ({
  left:  `${((i * 137.508) % 100).toFixed(2)}%`,
  top:   `${((i * 97.303 + 11) % 100).toFixed(2)}%`,
  size:  i % 7 === 0 ? "2px" : "1px",
  opacity: 0.06 + ((i * 0.083) % 0.18),
}));

const glassPanel = {
  background: "rgba(8,8,18,0.88)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "18px",
  boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
};

export default function Dashboard() {
  const { user }  = useAuth();
  const isAdmin   = user?.role === "admin";
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/Dashboard")
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#06060f", position: "relative" }}>
      {/* Global star field */}
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "fixed", borderRadius: "50%", background: "rgba(255,255,255,0.7)",
          width: s.size, height: s.size, left: s.left, top: s.top, opacity: s.opacity, pointerEvents: "none", zIndex: 0,
        }} />
      ))}
      {/* Nebula glows */}
      <div style={{ position: "fixed", top: "10%", right: "15%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", left: "20%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <Navbar title="Dashboard" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "16px" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>


              {/* KPI Cards */}
              {isAdmin ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: "16px" }}>
                  <StatCard title="TOTAL EVENTS"    value={stats?.totalEvents}    icon="◈" color="#7c3aed" delay="delay-1" />
                  <StatCard title="TOTAL ATTENDEES" value={stats?.totalAttendees} icon="◎" color="#10b981" delay="delay-2" />
                  <StatCard title="AVG FILL RATE"   value={stats?.avgFillRate}    icon="◫" color="#f59e0b" delay="delay-3" />
                  <StatCard title="TOTAL REVENUE"   value={`$${stats?.totalRevenue}`} icon="◆" color="#ef4444" delay="delay-4" />
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  <StatCard title="TOTAL EVENTS"    value={stats?.totalEvents}    icon="◈" color="#7c3aed" delay="delay-1" />
                  <StatCard title="TOTAL ATTENDEES" value={stats?.totalAttendees} icon="◎" color="#10b981" delay="delay-2" />
                  <StatCard title="AVG FILL RATE"   value={stats?.avgFillRate}    icon="◫" color="#f59e0b" delay="delay-3" />
                </div>
              )}

              {isAdmin ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Revenue Area Chart */}
                  <div className="animate-fade-up delay-2" style={{ ...glassPanel, padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                      <div>
                        <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>REVENUE TREND</p>
                        <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: 0 }}>Last 6 Months</p>
                      </div>
                      <div style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.2)", fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#a78bfa", letterSpacing: "1px" }}>6M</div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={stats?.monthlyRevenue}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)", fontFamily: "sans-serif" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                        <Tooltip content={<CustomTooltip prefix="$" />} />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revGrad)"
                          dot={{ fill: "#7c3aed", r: 4, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: "#a78bfa", stroke: "rgba(8,8,18,0.9)", strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Status Pie */}
                  <div className="animate-fade-up delay-3" style={{ ...glassPanel, padding: "24px" }}>
                    <p style={{ fontFamily:"sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>DISTRIBUTION</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", marginBottom: "16px", margin: "0 0 16px" }}>Status Breakdown</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={stats?.statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                          {stats?.statusBreakdown?.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(8,8,18,0.88)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "rgba(8,8,18,0.95)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="animate-fade-up delay-2" style={{ ...glassPanel, padding: "24px" }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>DISTRIBUTION</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: "0 0 16px" }}>Status Breakdown</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={stats?.statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                          {stats?.statusBreakdown?.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(8,8,18,0.88)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "rgba(8,8,18,0.95)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="animate-fade-up delay-3" style={{ ...glassPanel, padding: "24px" }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>ASSIGNED TO YOU</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: "0 0 16px" }}>Recent Events</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {!stats?.recentEvents?.length ? (
                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", fontFamily: "'DM Mono', monospace" }}>No events assigned yet.</p>
                      ) : stats.recentEvents.map(ev => {
                        const s = statusStyle[ev.status] || statusStyle.upcoming;
                        return (
                          <div key={ev.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 14px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "10px", transition: "border-color 0.2s",
                          }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                          >
                            <div>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>{ev.name}</p>
                              <p style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{ev.location} · {new Date(ev.date).toLocaleDateString()}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "20px", fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 500, letterSpacing: "1px", background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{ev.status}</span>
                              <p style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>{ev.attendees}/{ev.capacity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Recent Events Table */}
              {isAdmin && (
                <div className="animate-fade-up delay-4" style={{ ...glassPanel, overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>OVERVIEW</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: 0 }}>Recent Events</p>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Event", "Location", "Date", "Status", "Attendees", "Fill Rate", "Revenue"].map(h => (
                          <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentEvents?.map(ev => {
                        const s = statusStyle[ev.status] || statusStyle.upcoming;
                        return (
                          <tr key={ev.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</td>
                            <td style={{ padding: "14px 20px", fontFamily:"sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{ev.location}</td>
                            <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif", fontSize: "9px", fontWeight: 500, letterSpacing: "1px", background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{ev.status}</span>
                            </td>
                            <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{ev.attendees}</td>
                            <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{ev.fillRate}</td>
                            <td style={{ padding: "14px 20px", fontFamily:"sans-serif", fontSize: "12px", color: "#34d399", fontWeight: 600 }}>${ev.revenue ?? "0.00"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}