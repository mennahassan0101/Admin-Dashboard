import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "", location: "", date: "", description: "",
  capacity: "", status: "upcoming", ticketPrice: ""
};

export default function Events() {
  const { user } = useAuth();
  const isAdmin   = user?.role === "admin";

  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(emptyForm);

  // Edit modal state
  const [editEvent,   setEditEvent]   = useState(null);
  const [editForm,    setEditForm]    = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editError,   setEditError]   = useState("");

  const fetchEvents = () => {
    setLoading(true);
    API.get("/Events")
      .then(res => setEvents(res.data))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  // Open edit modal and prefill form
  const openEdit = (ev) => {
    setEditEvent(ev);
    setEditError("");
    setEditForm({
      name:        ev.name        || "",
      location:    ev.location    || "",
      date:        ev.date ? ev.date.split("T")[0] : "",
      description: ev.description || "",
      capacity:    ev.capacity    || "",
      status:      ev.status      || "upcoming",
      ticketPrice: ev.ticketPrice || "",
    });
  };

  const closeEdit = () => {
    setEditEvent(null);
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      await API.put(`/Events/update/${editEvent.id}`, editForm);
      closeEdit();
      fetchEvents();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update event");
    } finally {
      setEditLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/Events/create-event", form);
      setShowForm(false);
      setForm(emptyForm);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await API.delete(`/Events/delete/${id}`);
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

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Events" />
        <main className="flex-1 p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{events.length} events found</p>
            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                {showForm ? "Cancel" : "+ New Event"}
              </button>
            )}
          </div>

          {/* Create Form */}
          {showForm && isAdmin && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h3 className="sm:col-span-2 text-base font-semibold text-gray-700">Create New Event</h3>
              {[
                { label:"Name",         key:"name",        type:"text"           },
                { label:"Location",     key:"location",    type:"text"           },
                { label:"Date",         key:"date",        type:"date"           },
                { label:"Capacity",     key:"capacity",    type:"number"         },
                { label:"Ticket Price", key:"ticketPrice", type:"number"         },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type} required
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className={inputClass}
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
                  className={inputClass}
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
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Capacity</th>
                    <th className="px-4 py-3 text-left">Attendees</th>
                    <th className="px-4 py-3 text-left">Fill Rate</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">General</th>
                    <th className="px-4 py-3 text-left">VIP</th>
                    {isAdmin && <th className="px-4 py-3 text-left">Revenue</th>}
                    {isAdmin && <th className="px-4 py-3 text-left">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map(ev => (
                    <tr key={ev.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{ev.name}</td>
                      <td className="px-4 py-3 text-gray-500">{ev.location}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(ev.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-500">{ev.capacity}</td>
                      <td className="px-4 py-3 text-gray-500">{ev.attendees}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {ev.capacity > 0
                          ? ((ev.attendees / ev.capacity) * 100).toFixed(1) + "%"
                          : "0%"
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[ev.status]}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">${parseFloat(ev.ticketPrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-purple-600 font-medium">${(parseFloat(ev.ticketPrice) * 2).toFixed(2)}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-green-600 font-medium">
                          ${(ev.attendees * parseFloat(ev.ticketPrice)).toFixed(2)}
                        </td>
                      )}
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(ev)}
                              className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(ev.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ── EDIT MODAL ── */}
      {editEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Edit Event</h2>
              <button
                onClick={closeEdit}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {editError && (
                <div className="sm:col-span-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text" required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text" required
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date" required
                  value={editForm.date}
                  onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number" required
                  value={editForm.capacity}
                  onChange={e => setEditForm({ ...editForm, capacity: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price ($)</label>
                <input
                  type="number" required
                  value={editForm.ticketPrice}
                  onChange={e => setEditForm({ ...editForm, ticketPrice: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className={inputClass}
                >
                  {["upcoming","live","selling","closed"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className={inputClass}
                  rows={3}
                />
              </div>

              {/* Modal Footer */}
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}