import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", location: "", date: "", description: "",
    capacity: "", status: "upcoming", ticketPrice: ""
  });

  const fetchEvents = () => {
    API.get("/events")
      .then(res => setEvents(res.data))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events/create-event", form);
      setShowForm(false);
      setForm({ name:"", location:"", date:"", description:"", capacity:"", status:"upcoming", ticketPrice:"" });
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch {
      setError("Failed to delete event");
    }
  };

  const statusColor = {
    upcoming: "bg-blue-100 text-blue-700",
    live:     "bg-green-100 text-green-700",
    selling:  "bg-yellow-100 text-yellow-700",
    closed:   "bg-red-100 text-red-700",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Events" />
        <main className="flex-1 p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{events.length} events found</p>
            {user?.role === "admin" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                {showForm ? "Cancel" : "+ New Event"}
              </button>
            )}
          </div>

          {/* Create Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label:"Name",        key:"name",        type:"text" },
                { label:"Location",    key:"location",    type:"text" },
                { label:"Date",        key:"date",        type:"datetime-local" },
                { label:"Capacity",    key:"capacity",    type:"number" },
                { label:"Ticket Price",key:"ticketPrice", type:"number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type} required
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {["upcoming","live","selling","closed"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Create Event
                </button>
              </div>
            </form>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Events Table */}
          {loading ? <p className="text-gray-500">Loading...</p> : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    {["Name","Location","Date","Capacity","Ticket Price","Status","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map(ev => (
                    <tr key={ev.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{ev.name}</td>
                      <td className="px-4 py-3 text-gray-500">{ev.location}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(ev.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-500">{ev.capacity}</td>
                      <td className="px-4 py-3 text-gray-500">${ev.ticketPrice}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[ev.status]}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user?.role === "admin" && (
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}