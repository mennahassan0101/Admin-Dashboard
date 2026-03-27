import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { Btn } from "../components/UI.jsx";

const inputStyle = {
  width: "100%", padding: "11px 14px",
  background: "var(--surface2)", border: "1px solid var(--border)",
  borderRadius: "8px", color: "var(--text)",
  fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
  outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

const FieldGroup = ({ label, children }) => (
  <div>
    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
    {children}
  </div>
);

const StepDot = ({ num, active, done }) => (
  <div style={{
    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: 700, transition: "all 0.2s",
    background: done ? "#10b981" : active ? "#2563eb" : "var(--surface2)",
    border: `1px solid ${done ? "#10b981" : active ? "#2563eb" : "var(--border)"}`,
    color: (done || active) ? "white" : "var(--muted)",
  }}>
    {done ? "✓" : num}
  </div>
);

export default function Users() {
  const [users,    setUsers]    = useState([]);
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [showForm, setShowForm] = useState(false);
  const [step,     setStep]     = useState(1);
  const [newUserId,    setNewUserId]    = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "manager" });
  const [focusedField, setFocusedField] = useState(null);

  const fetchUsers  = () => { API.get("/Users/").then(res => setUsers(res.data)).catch(() => setError("Failed to load users")).finally(() => setLoading(false)); };
  const fetchEvents = () => { API.get("/Events").then(res => setEvents(res.data)).catch(console.error); };

  useEffect(() => { fetchUsers(); fetchEvents(); }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "manager" });
    setSelectedEvents([]); setNewUserId(null); setStep(1); setShowForm(false); setError("");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault(); setError("");
    try {
      const res = await API.post("/Users/add-user", form);
      setNewUserId(res.data.user.id);
      if (form.role === "manager") setStep(2);
      else { fetchUsers(); resetForm(); }
    } catch (err) { setError(err.response?.data?.message || "Failed to create user"); }
  };

  const handleAssignEvents = async () => {
    setError("");
    try {
      await Promise.all(selectedEvents.map(eventId => API.post(`/Events/${eventId}/assign`, { managerId: newUserId })));
      fetchUsers(); resetForm();
    } catch (err) { setError(err.response?.data?.message || "Failed to assign events"); }
  };

  const toggleEvent = (id) => setSelectedEvents(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try { await API.delete(`/Users/${id}`); fetchUsers(); }
    catch (err) { setError(err.response?.data?.message || "Failed to delete user"); }
  };

  const getFocusStyle = (field) => ({
    ...inputStyle,
    borderColor: focusedField === field ? "#2563eb" : "var(--border)",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Users" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1.5px", fontWeight: 600 }}>TOTAL</p>
              <p style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)" }}>
                {users.length} <span style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "'DM Sans'" }}>users</span>
              </p>
            </div>
            <Btn onClick={() => { setShowForm(!showForm); setStep(1); setError(""); }} variant={showForm ? "ghost" : "primary"}>
              {showForm ? "✕ Cancel" : "+ New User"}
            </Btn>
          </div>

          {/* Step 1 — Create User */}
          {showForm && step === 1 && (
            <div className="animate-fade-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px 28px", marginBottom: "24px" }}>
              {/* Stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <StepDot num={1} active={true} done={false} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>User Info</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                <StepDot num={2} active={false} done={false} />
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>Assign Events</span>
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>
              )}

              <form onSubmit={handleCreateUser} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <FieldGroup label="FULL NAME">
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sara Ahmed" style={getFocusStyle("name")}
                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} />
                </FieldGroup>
                <FieldGroup label="EMAIL">
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="sara@example.com" style={getFocusStyle("email")}
                    onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
                </FieldGroup>
                <FieldGroup label="PASSWORD">
                  <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••" style={getFocusStyle("password")}
                    onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} />
                </FieldGroup>
                <FieldGroup label="ROLE">
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </FieldGroup>
                <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                  <Btn variant="ghost" onClick={resetForm} type="button">Cancel</Btn>
                  <Btn type="submit">{form.role === "manager" ? "Next: Assign Events →" : "Create Admin"}</Btn>
                </div>
              </form>
            </div>
          )}

          {/* Step 2 — Assign Events */}
          {showForm && step === 2 && (
            <div className="animate-fade-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px 28px", marginBottom: "24px" }}>
              {/* Stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <StepDot num={1} active={false} done={true} />
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>User Info</span>
                <div style={{ flex: 1, height: "1px", background: "#10b981", opacity: 0.4 }} />
                <StepDot num={2} active={true} done={false} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Assign Events</span>
              </div>

              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
                Select events to assign to <span style={{ color: "var(--text)", fontWeight: 600 }}>{form.name}</span>. You can skip and assign later.
              </p>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxHeight: "280px", overflowY: "auto", marginBottom: "16px", paddingRight: "4px" }}>
                {events.map(ev => {
                  const isSelected = selectedEvents.includes(ev.id);
                  const statusColors = { upcoming: "#60a5fa", live: "#34d399", selling: "#fbbf24", closed: "#94a3b8" };
                  return (
                    <div key={ev.id} onClick={() => toggleEvent(ev.id)} style={{
                      padding: "14px", borderRadius: "10px", cursor: "pointer",
                      border: `1px solid ${isSelected ? "#2563eb" : "var(--border)"}`,
                      background: isSelected ? "rgba(37,99,235,0.1)" : "var(--surface2)",
                      transition: "all 0.15s",
                    }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "#3b4565"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "var(--border)"; }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>{ev.name}</p>
                          <p style={{ fontSize: "11px", color: "var(--muted)" }}>{ev.location}</p>
                          <p style={{ fontSize: "11px", color: "var(--muted)" }}>{new Date(ev.date).toLocaleDateString()}</p>
                        </div>
                        <div style={{
                          width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, marginLeft: "10px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `2px solid ${isSelected ? "#2563eb" : "var(--border)"}`,
                          background: isSelected ? "#2563eb" : "transparent",
                          transition: "all 0.15s",
                        }}>
                          {isSelected && <span style={{ color: "white", fontSize: "10px", fontWeight: 700 }}>✓</span>}
                        </div>
                      </div>
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "10px", color: statusColors[ev.status] || "#60a5fa" }}>● {ev.status}</span>
                        <span style={{ fontSize: "10px", color: "var(--muted)" }}>{ev.attendees}/{ev.capacity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "16px" }}>
                {selectedEvents.length === 0 ? "No events selected" : `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""} selected`}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <Btn variant="ghost" onClick={resetForm}>Cancel</Btn>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { fetchUsers(); resetForm(); }} style={{ padding: "9px 16px", background: "transparent", border: "none", color: "var(--muted)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Skip for now
                  </button>
                  <Btn onClick={handleAssignEvents} disabled={selectedEvents.length === 0}>Assign & Finish</Btn>
                </div>
              </div>
            </div>
          )}

          {error && !showForm && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>
          )}

          {/* Users Table */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: "52px", borderRadius: "8px" }} />)}
            </div>
          ) : (
            <div className="animate-fade-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                    {["Name","Email","Role","Joined","Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1.5px", fontFamily: "'Sora', sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const isAdmin = u.role === "admin";
                    return (
                      <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", animationDelay: `${i * 0.04}s` }} className="animate-fade-up"
                        onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                              background: isAdmin ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "12px", fontWeight: 700, color: "white",
                            }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{u.email}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px",
                            background: isAdmin ? "rgba(239,68,68,0.15)" : "rgba(37,99,235,0.15)",
                            border: `1px solid ${isAdmin ? "rgba(239,68,68,0.3)" : "rgba(37,99,235,0.3)"}`,
                            color: isAdmin ? "#f87171" : "#60a5fa",
                            fontFamily: "'Sora', sans-serif",
                          }}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--muted)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "14px 20px" }}>
                          {!isAdmin ? (
                            <button onClick={() => handleDelete(u.id)} style={{
                              fontSize: "11px", fontWeight: 600, color: "#f87171",
                              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                              padding: "4px 12px", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s",
                            }}
                              onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.2)"}
                              onMouseLeave={e => e.target.style.background = "rgba(239,68,68,0.1)"}>
                              Delete
                            </button>
                          ) : (
                            <span style={{ fontSize: "12px", color: "var(--border)" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}