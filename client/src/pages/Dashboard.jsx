import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#ef4444", "#10b981", "#f59e0b", "#3b82f6"];

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? "—"}</p>
  </div>
);

const statusColor = {
  upcoming: "bg-blue-100 text-blue-700",
  live:     "bg-green-100 text-green-700",
  selling:  "bg-yellow-100 text-yellow-700",
  closed:   "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { user }    = useAuth();
  const isAdmin     = user?.role === "admin";
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/Dashboard")
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Dashboard" />
        <main className="flex-1 p-6 space-y-6">
          {loading ? <p className="text-gray-500">Loading...</p> : (
            <>
              {/* KPI Cards */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
                <StatCard title="Total Events"    value={stats?.totalEvents}    color="border-blue-500"   />
                <StatCard title="Total Attendees" value={stats?.totalAttendees} color="border-yellow-500" />
                <StatCard title="Avg Fill Rate"   value={stats?.avgFillRate}    color="border-green-500"  />
                {isAdmin && (
                  <StatCard title="Total Revenue" value={`$${stats?.totalRevenue}`} color="border-red-500" />
                )}
              </div>

              {/* ADMIN — Revenue Over Time + Status Breakdown */}
              {isAdmin ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Revenue Over Time Line Chart */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-semibold text-gray-700">Revenue Over Time</h3>
                      <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                        6 MONTHS
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={stats?.monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={v => `$${(v/1000).toFixed(0)}K`}
                        />
                        <Tooltip
                          formatter={v => [`$${v.toFixed(2)}`, "Revenue"]}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Status Breakdown Pie */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={stats?.statusBreakdown}
                          dataKey="count"
                          nameKey="status"
                          cx="50%" cy="50%"
                          outerRadius={100}
                          label={({ status, count }) => `${status}: ${count}`}
                        >
                          {stats?.statusBreakdown?.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              ) : (
                /* MANAGER — Status Breakdown + Recent Events */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Status Breakdown Pie */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={stats?.statusBreakdown}
                          dataKey="count"
                          nameKey="status"
                          cx="50%" cy="50%"
                          outerRadius={80}
                          label
                        >
                          {stats?.statusBreakdown?.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent Assigned Events */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      My Recent Assigned Events
                    </h3>
                    <div className="space-y-3">
                      {stats?.recentEvents?.length === 0 ? (
                        <p className="text-gray-400 text-sm">No events assigned yet.</p>
                      ) : (
                        stats?.recentEvents?.map(ev => (
                          <div key={ev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{ev.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {ev.location} · {new Date(ev.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[ev.status]}`}>
                                {ev.status}
                              </span>
                              <p className="text-xs text-gray-400 mt-1">
                                {ev.attendees}/{ev.capacity} · {ev.fillRate}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* ADMIN ONLY — Recent Events Table */}
              {isAdmin && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Events</h3>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                      <tr>
                        {["Event", "Location", "Date", "Status", "Attendees", "Fill Rate", "Revenue"].map(h => (
                          <th key={h} className="px-4 py-3 text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats?.recentEvents?.map(ev => (
                        <tr key={ev.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{ev.name}</td>
                          <td className="px-4 py-3 text-gray-500">{ev.location}</td>
                          <td className="px-4 py-3 text-gray-500">{new Date(ev.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[ev.status]}`}>
                              {ev.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{ev.attendees}</td>
                          <td className="px-4 py-3 text-gray-500">{ev.fillRate}</td>
                          <td className="px-4 py-3 text-green-600 font-medium">
                            ${ev.revenue ?? "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </>
          )}
        </main>
      </div>
    </div>
  );
}