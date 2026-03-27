import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";

export default function Analytics() {
  const [stats,      setStats]      = useState(null);
  const [engagement, setEngagement] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/analytics/stats"),
      API.get("/analytics/engagement"),
    ]).then(([s, e]) => {
      setStats(s.data);
      setEngagement(e.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Analytics" />
        <main className="flex-1 p-6">
          {loading ? <p className="text-gray-500">Loading...</p> : (
            <div className="space-y-6">

              {/* KPI Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Events",    value: stats?.totalEvents },
                  { label: "Total Users",     value: stats?.totalUsers },
                  { label: "Total Attendees", value: stats?.totalAttendees },
                  { label: "Fill Rate",       value: stats?.fillRate },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                  </div>
                ))}
              </div>

              {/* Engagement Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Engagement per Event</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="attendees" fill="#3b82f6" radius={[4,4,0,0]} name="Attendees" />
                    <Bar dataKey="capacity"  fill="#e5e7eb" radius={[4,4,0,0]} name="Capacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Table */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      {["Event","Attendees","Capacity","Fill Rate","Status"].map(h => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {engagement.map(ev => (
                      <tr key={ev.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{ev.name}</td>
                        <td className="px-4 py-3 text-gray-500">{ev.attendees}</td>
                        <td className="px-4 py-3 text-gray-500">{ev.capacity}</td>
                        <td className="px-4 py-3 text-gray-500">{ev.fillRate}</td>
                        <td className="px-4 py-3 text-gray-500">{ev.status}</td>
                      </tr>
                    ))}
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