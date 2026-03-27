import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";

export default function Users() {
  const [users,    setUsers]    = useState([]);
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [showForm, setShowForm] = useState(false);
  const [step,     setStep]     = useState(1);  // 1 = user info, 2 = assign events
  const [newUserId, setNewUserId] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"manager" });

  const fetchUsers = () => {
    API.get("/Users/")
      .then(res => setUsers(res.data))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  };

  const fetchEvents = () => {
    API.get("/Events")
      .then(res => setEvents(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const resetForm = () => {
    setForm({ name:"", email:"", password:"", role:"manager" });
    setSelectedEvents([]);
    setNewUserId(null);
    setStep(1);
    setShowForm(false);
    setError("");
  };

  // Step 1 — Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/Users/add-user", form);
      setNewUserId(res.data.user.id);

      // if role is manager move to step 2 to assign events
      if (form.role === "manager") {
        setStep(2);
      } else {
        // admin role — no event assignment needed
        fetchUsers();
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  // Step 2 — Assign events to manager
  const handleAssignEvents = async () => {
    setError("");
    try {
      // assign each selected event
      await Promise.all(
        selectedEvents.map(eventId =>
          API.post(`/Events/${eventId}/assign`, { managerId: newUserId })
        )
      );
      fetchUsers();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign events");
    }
  };

  const toggleEvent = (id) => {
    setSelectedEvents(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await API.delete(`/Users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const roleColor = {
    admin:   "bg-red-100 text-red-700",
    manager: "bg-blue-100 text-blue-700",
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Users" />
        <main className="flex-1 p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{users.length} users found</p>
            <button
              onClick={() => { setShowForm(!showForm); setStep(1); setError(""); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              {showForm ? "Cancel" : "+ New User"}
            </button>
          </div>

          {/* ── STEP 1 — Create User Form ── */}
          {showForm && step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">1</div>
                  <span className="text-sm font-semibold text-gray-700">User Info</span>
                </div>
                <div className="flex-1 h-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 text-xs flex items-center justify-center font-semibold">2</div>
                  <span className="text-sm text-gray-400">Assign Events</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
              )}

              <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sara Ahmed"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="sara@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password" required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className={inputClass}
                  >
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {form.role === "manager" ? "Next: Assign Events →" : "Create Admin"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 2 — Assign Events ── */}
          {showForm && step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold">✓</div>
                  <span className="text-sm text-gray-400">User Info</span>
                </div>
                <div className="flex-1 h-px bg-blue-200" />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">2</div>
                  <span className="text-sm font-semibold text-gray-700">Assign Events</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Select events to assign to <span className="font-semibold text-gray-700">{form.name}</span>. You can skip this and assign later.
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
              )}

              {/* Event Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
                {events.map(ev => {
                  const isSelected = selectedEvents.includes(ev.id);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => toggleEvent(ev.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{ev.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{ev.location}</p>
                          <p className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString()}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 mt-0.5 flex-shrink-0 ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          ev.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                          ev.status === "live"     ? "bg-green-100 text-green-700" :
                          ev.status === "selling"  ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {ev.status}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {ev.attendees}/{ev.capacity} attendees
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected count */}
              <p className="text-xs text-gray-400 mb-4">
                {selectedEvents.length === 0
                  ? "No events selected"
                  : `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""} selected`
                }
              </p>

              <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => { fetchUsers(); resetForm(); }}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleAssignEvents}
                    disabled={selectedEvents.length === 0}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Assign & Finish
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && !showForm && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Users Table */}
          {loading ? <p className="text-gray-500">Loading...</p> : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColor[u.role]}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {u.role !== "admin" ? (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
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