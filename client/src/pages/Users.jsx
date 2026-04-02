import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { Btn } from "../components/UI.jsx";

const glassInput = {
  width: "100%", padding: "12px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "#fff",
  fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const glassPanel = {
  background: "rgba(8,8,18,0.88)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "18px",
  boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
};

const stars = Array.from({ length: 35 }, (_, i) => ({
  left:  `${((i * 137.508) % 100).toFixed(2)}%`,
  top:   `${((i * 97.303 + 11) % 100).toFixed(2)}%`,
  size:  i % 7 === 0 ? "2px" : "1px",
  opacity: 0.05 + ((i * 0.083) % 0.15),
}));

const FieldLabel = ({ children }) => (
  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "8px" }}>
    {children}
  </label>
);

const StepDot = ({ num, active, done }) => (
  <div style={{
    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'DM Mono', monospace", fontSize: "11px", fontWeight: 700,
    transition: "all 0.2s",
    background: done ? "rgba(16,185,129,0.2)" : active ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${done ? "rgba(16,185,129,0.5)" : active ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.1)"}`,
    color: done ? "#34d399" : active ? "#a78bfa" : "rgba(255,255,255,0.3)",
    boxShadow: done ? "0 0 14px rgba(16,185,129,0.2)" : active ? "0 0 14px rgba(139,92,246,0.2)" : "none",
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
  const [newUserId,     setNewUserId]     = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "manager" });
  const [focusedField, setFocusedField] = useState(null);
  const [deleteId,      setDeleteId]      = useState(null);
  const [deleteName,    setDeleteName]    = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleted,     setIsDeleted]     = useState(false);

  const fetchUsers  = () => { API.get("/users/").then(res => setUsers(res.data)).catch(() => setError("Failed to load users")).finally(() => setLoading(false)); };
  const fetchEvents = () => { API.get("/events").then(res => setEvents(res.data)).catch(console.error); };

  useEffect(() => { fetchUsers(); fetchEvents(); }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "manager" });
    setSelectedEvents([]); setNewUserId(null); setStep(1); setShowForm(false); setError("");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault(); setError("");
    try {
      const res = await API.post("/users/add-user", form);
      setNewUserId(res.data.user.id);
      if (form.role === "manager") setStep(2);
      else { fetchUsers(); resetForm(); }
    } catch (err) { setError(err.response?.data?.message || "Failed to create user"); }
  };

  const handleAssignEvents = async () => {
    setError("");
    try {
      await Promise.all(selectedEvents.map(eventId => API.post(`/events/update/${eventId}/assign`, { managerId: newUserId })));
      fetchUsers(); resetForm();
    } catch (err) { setError(err.response?.data?.message || "Failed to assign events"); }
  };

  const toggleEvent = (id) => setSelectedEvents(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/users/${deleteId}`);
      setIsDeleted(true);
      setTimeout(() => { setDeleteId(null); setDeleteName(""); setIsDeleted(false); fetchUsers(); }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      setDeleteId(null); setDeleteName("");
    } finally { setDeleteLoading(false); }
  };

  const getFocusStyle = (field) => ({
    ...glassInput,
    borderColor: focusedField === field ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.1)",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.08)" : "none",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#06060f", position: "relative" }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position: "fixed", borderRadius: "50%", background: "rgba(255,255,255,0.7)", width: s.size, height: s.size, left: s.left, top: s.top, opacity: s.opacity, pointerEvents: "none", zIndex: 0 }} />
      ))}
      <div style={{ position: "fixed", top: "5%", left: "25%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <Navbar title="Users" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>TOTAL</p>
              <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", letterSpacing: "2px", color: "var(--text)", margin: 0 }}>
                {users.length} <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "14px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>users</span>
              </p>
            </div>
            <Btn onClick={() => { setShowForm(!showForm); setStep(1); setError(""); }} variant={showForm ? "ghost" : "primary"}>
              {showForm ? "✕ Cancel" : "+ New User"}
            </Btn>
          </div>

          {/* Step 1 — Create User */}
          {showForm && step === 1 && (
            <div className="animate-fade-up" style={{ ...glassPanel, padding: "28px", marginBottom: "24px" }}>
              {/* Stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <StepDot num={1} active={true} done={false} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", fontWeight: 500, color: "rgba(167,139,250,0.9)", letterSpacing: "1px" }}>USER INFO</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                <StepDot num={2} active={false} done={false} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>ASSIGN EVENTS</span>
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "12px 16px", borderRadius: "10px", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.5px", marginBottom: "16px" }}>⚠ {error}</div>
              )}

              <form onSubmit={handleCreateUser} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "FULL NAME", key: "name", type: "text", placeholder: "e.g. Sara Ahmed" },
                  { label: "EMAIL", key: "email", type: "email", placeholder: "sara@example.com" },
                  { label: "PASSWORD", key: "password", type: "password", placeholder: "••••••••" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <FieldLabel>{label}</FieldLabel>
                    <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder} style={getFocusStyle(key)}
                      onFocus={() => setFocusedField(key)} onBlur={() => setFocusedField(null)} />
                  </div>
                ))}
                <div>
                  <FieldLabel>ROLE</FieldLabel>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}               style={{
                    ...glassInput, // This applies your dark glass style
                    background: "rgba(9, 9, 11, 0.9)", // Ensures the dropdown list itself is dark
                    color: "white",
                    appearance: "none", // Removes default browser styling
                    cursor: "pointer"
                  }}>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Btn variant="ghost" onClick={resetForm} type="button">Cancel</Btn>
                  <Btn type="submit">{form.role === "manager" ? "Next: Assign Events →" : "Create Admin"}</Btn>
                </div>
              </form>
            </div>
          )}

          {/* Step 2 — Assign Events */}
          {showForm && step === 2 && (
            <div className="animate-fade-up" style={{ ...glassPanel, padding: "28px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <StepDot num={1} active={false} done={true} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>USER INFO</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(16,185,129,0.3)" }} />
                <StepDot num={2} active={true} done={false} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", fontWeight: 500, color: "rgba(167,139,250,0.9)", letterSpacing: "1px" }}>ASSIGN EVENTS</span>
              </div>

              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "16px", letterSpacing: "0.5px", lineHeight: "1.6" }}>
                Select events to assign to <span style={{ color: "#a78bfa", fontWeight: 600 }}>{form.name}</span>. You can skip and assign later.
              </p>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "12px 16px", borderRadius: "10px", fontFamily: "'DM Mono', monospace", fontSize: "11px", marginBottom: "16px" }}>⚠ {error}</div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxHeight: "280px", overflowY: "auto", marginBottom: "16px", paddingRight: "4px" }}>
                {events.map(ev => {
                  const isSelected = selectedEvents.includes(ev.id);
                  const statusColors = { upcoming: "#60a5fa", live: "#34d399", selling: "#fbbf24", closed: "#94a3b8" };
                  return (
                    <div key={ev.id} onClick={() => toggleEvent(ev.id)} style={{
                      padding: "14px", borderRadius: "12px", cursor: "pointer",
                      border: `1px solid ${isSelected ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.07)"}`,
                      background: isSelected ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.15s",
                      boxShadow: isSelected ? "0 0 20px rgba(124,58,237,0.1)" : "none",
                    }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>{ev.name}</p>
                          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>{ev.location}</p>
                          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{new Date(ev.date).toLocaleDateString()}</p>
                        </div>
                        <div style={{
                          width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, marginLeft: "10px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `2px solid ${isSelected ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.15)"}`,
                          background: isSelected ? "rgba(124,58,237,0.3)" : "transparent",
                          transition: "all 0.15s",
                        }}>
                          {isSelected && <span style={{ color: "#a78bfa", fontSize: "10px", fontWeight: 700 }}>✓</span>}
                        </div>
                      </div>
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: statusColors[ev.status] || "#60a5fa", letterSpacing: "1px" }}>● {ev.status?.toUpperCase()}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>{ev.attendees}/{ev.capacity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginBottom: "16px", letterSpacing: "1px" }}>
                {selectedEvents.length === 0 ? "NO EVENTS SELECTED" : `${selectedEvents.length} EVENT${selectedEvents.length > 1 ? "S" : ""} SELECTED`}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Btn variant="ghost" onClick={resetForm}>Cancel</Btn>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { fetchUsers(); resetForm(); }} style={{ padding: "10px 16px", background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", fontSize: "11px", cursor: "pointer", letterSpacing: "1px" }}>
                    Skip for now
                  </button>
                  <Btn onClick={handleAssignEvents} disabled={selectedEvents.length === 0}>Assign & Finish</Btn>
                </div>
              </div>
            </div>
          )}

          {error && !showForm && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "12px 16px", borderRadius: "10px", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.5px", marginBottom: "16px" }}>⚠ {error}</div>
          )}

          {/* Users Table */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: "54px", borderRadius: "10px" }} />)}
            </div>
          ) : (
            <div className="animate-fade-up" style={{ ...glassPanel, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Name","Email","Role","Joined","Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const isAdminUser = u.role === "admin";
                    return (
                      <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", animationDelay: `${i * 0.04}s`, transition: "background 0.15s" }} className="animate-fade-up"
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                              background: isAdminUser
                                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "12px", fontWeight: 700, color: "white",
                              boxShadow: isAdminUser ? "0 0 14px rgba(239,68,68,0.35)" : "0 0 14px rgba(124,58,237,0.35)",
                            }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{u.email}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: "20px",
                            fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 500, letterSpacing: "1px",
                            background: isAdminUser ? "rgba(239,68,68,0.12)" : "rgba(124,58,237,0.12)",
                            border: `1px solid ${isAdminUser ? "rgba(239,68,68,0.3)" : "rgba(139,92,246,0.3)"}`,
                            color: isAdminUser ? "#f87171" : "#a78bfa",
                          }}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "14px 20px" }}>
                          {!isAdminUser ? (
                            <button onClick={() => { setDeleteId(u.id); setDeleteName(u.name); }} style={{
                              fontFamily: "sans-serif", fontSize: "10px", fontWeight: 600, color: "#f87171",
                              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                              padding: "4px 12px", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.5px",
                            }}
                              onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.2)"}
                              onMouseLeave={e => e.target.style.background = "rgba(239,68,68,0.1)"}>
                              DELETE
                            </button>
                          ) : (
                            <span style={{ fontFamily:"sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.1)" }}>—</span>
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "380px", padding: "0 20px" }}>
            {/* Glowing halo */}
            <div style={{
              position: "absolute", inset: "-1px", borderRadius: "20px",
              background: isDeleted
                ? "linear-gradient(135deg, rgba(16,185,129,0.4), rgba(52,211,153,0.2))"
                : "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(220,38,38,0.2))",
              filter: "blur(1px)", zIndex: -1, animation: "pulseGlow 3.5s ease infinite",
            }} />
            <div style={{
              background: "rgba(6,6,15,0.97)",
              border: isDeleted ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(239,68,68,0.15)",
              borderRadius: "20px", padding: "36px", textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            }}>
              {!isDeleted ? (
                <>
                  {/* Icon */}
                  <div style={{ width: "60px", height: "60px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px" }}>
                    🗑
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", letterSpacing: "2px", color: "var(--text)", marginBottom: "8px" }}>Delete User?</h3>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px", lineHeight: "1.7", letterSpacing: "0.3px" }}>
                    You are about to permanently delete
                  </p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "#a78bfa", fontWeight: 700, marginBottom: "24px", letterSpacing: "0.5px" }}>
                    {deleteName}
                  </p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", marginBottom: "28px", letterSpacing: "0.3px" }}>
                    This action cannot be undone.
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => { setDeleteId(null); setDeleteName(""); }}
                      style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
                      onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: deleteLoading ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(239,68,68,0.35)", letterSpacing: "0.5px", opacity: deleteLoading ? 0.7 : 1 }}
                    >
                      {deleteLoading ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={{ width: "60px", height: "60px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px", color: "#10b981" }}>✓</div>
                  <button style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#34d399", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "2px", cursor: "default" }}>
                    User Removed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}