import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [engagement, setEngagement] = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    API.get("/Analytics/engagement")
      .then(res => setEngagement(res.data))
      .catch(console.error)
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

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Events",    value: engagement?.totalEvents },
                  { label: "Total Attendees", value: engagement?.totalAttendees },
                  { label: "Total Capacity",  value: engagement?.totalCapacity },
                  { label: "Fill Rate",       value: engagement?.fillRate },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value ?? "—"}</p>
                  </div>
                ))}
              </div>

              {/* Engagement Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  {isAdmin ? "All Events Engagement" : "My Assigned Events Engagement"}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagement?.events}>
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
                      {["Event", "Attendees", "Capacity", "Fill Rate", "Status"].map(h => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {engagement?.events?.map(ev => (
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