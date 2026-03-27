import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart
} from "recharts";
import { StatCard, Badge, Tr, Td } from "../components/UI.jsx";

const COLORS = ["#ef4444", "#10b981", "#f59e0b", "#2563eb"];

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
      background: "var(--surface2)", border: "1px solid var(--border)",
      borderRadius: "10px", padding: "12px 16px", fontSize: "12px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    }}>
      <p style={{ color: "var(--muted)", marginBottom: "6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
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
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Dashboard" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "14px" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${isAdmin ? 4 : 3}, 1fr)`, gap: "16px" }}>
                <StatCard title="TOTAL EVENTS"    value={stats?.totalEvents}    icon="◈" color="#2563eb" delay="delay-1" />
                <StatCard title="TOTAL ATTENDEES" value={stats?.totalAttendees} icon="◎" color="#10b981" delay="delay-2" />
                <StatCard title="AVG FILL RATE"   value={stats?.avgFillRate}    icon="◫" color="#f59e0b" delay="delay-3" />
                {isAdmin && (
                  <StatCard title="TOTAL REVENUE" value={`$${stats?.totalRevenue}`} icon="◆" color="#ef4444" delay="delay-4" />
                )}
              </div>

              {isAdmin ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Revenue Area Chart */}
                  <div className="animate-fade-up delay-2" style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "16px", padding: "24px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600 }}>REVENUE TREND</p>
                        <p style={{ fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginTop: "4px" }}>
                          Last 6 Months
                        </p>
                      </div>
                      <div style={{
                        padding: "4px 12px", borderRadius: "20px",
                        background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
                        fontSize: "11px", color: "#60a5fa", fontWeight: 600,
                      }}>6M</div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={stats?.monthlyRevenue}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3d" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                        <Tooltip content={<CustomTooltip prefix="$" />} />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#2563eb", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#2563eb", stroke: "var(--surface)", strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Status Pie */}
                  <div className="animate-fade-up delay-3" style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "16px", padding: "24px",
                  }}>
                    <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600, marginBottom: "4px" }}>DISTRIBUTION</p>
                    <p style={{ fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginBottom: "16px" }}>Status Breakdown</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={stats?.statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                          {stats?.statusBreakdown?.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--surface)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px", color: "var(--muted)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Manager pie */}
                  <div className="animate-fade-up delay-2" style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "16px", padding: "24px",
                  }}>
                    <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600, marginBottom: "4px" }}>DISTRIBUTION</p>
                    <p style={{ fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginBottom: "16px" }}>Status Breakdown</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={stats?.statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                          {stats?.statusBreakdown?.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--surface)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px", color: "var(--muted)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent assigned events */}
                  <div className="animate-fade-up delay-3" style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "16px", padding: "24px",
                  }}>
                    <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600, marginBottom: "4px" }}>ASSIGNED TO YOU</p>
                    <p style={{ fontSize: "20px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginBottom: "16px" }}>Recent Events</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {!stats?.recentEvents?.length ? (
                        <p style={{ color: "var(--muted)", fontSize: "13px" }}>No events assigned yet.</p>
                      ) : stats.recentEvents.map(ev => {
                        const s = statusStyle[ev.status] || statusStyle.upcoming;
                        return (
                          <div key={ev.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 14px", background: "var(--surface2)",
                            borderRadius: "10px", border: "1px solid var(--border)",
                          }}>
                            <div>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>{ev.name}</p>
                              <p style={{ fontSize: "11px", color: "var(--muted)" }}>{ev.location} · {new Date(ev.date).toLocaleDateString()}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{ev.status}</span>
                              <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>{ev.attendees}/{ev.capacity}</p>
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
                <div className="animate-fade-up delay-4" style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "16px", overflow: "hidden",
                }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600 }}>OVERVIEW</p>
                    <p style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)", marginTop: "2px" }}>Recent Events</p>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                        {["Event", "Location", "Date", "Status", "Attendees", "Fill Rate", "Revenue"].map(h => (
                          <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1.5px", fontFamily: "'Sora', sans-serif" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentEvents?.map(ev => {
                        const s = statusStyle[ev.status] || statusStyle.upcoming;
                        return (
                          <tr key={ev.id} style={{ borderBottom: "1px solid var(--border)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</td>
                            <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{ev.location}</td>
                            <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{ev.status}</span>
                            </td>
                            <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{ev.attendees}</td>
                            <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{ev.fillRate}</td>
                            <td style={{ padding: "14px 20px", fontSize: "13px", color: "#10b981", fontWeight: 600 }}>${ev.revenue ?? "0.00"}</td>
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