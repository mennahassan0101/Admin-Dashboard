import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

export default function Revenue() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/revenue")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Revenue" />
        <main className="flex-1 p-6">
          {loading ? <p className="text-gray-500">Loading...</p> : (
            <div className="space-y-6">

              {/* Total Revenue Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-500">Total Platform Revenue</p>
                <p className="text-4xl font-bold text-gray-800 mt-1">${data?.totalRevenue}</p>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue per Event</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data?.events}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={(v) => `$${v}`} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      {["Event","Date","Attendees","Ticket Price","Revenue","Status"].map(h => (
                        <th key={h} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.events?.map(ev => (
                      <tr key={ev.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{ev.name}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(ev.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-500">{ev.attendees}</td>
                        <td className="px-4 py-3 text-gray-500">${ev.ticketPrice}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">${ev.revenue}</td>
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