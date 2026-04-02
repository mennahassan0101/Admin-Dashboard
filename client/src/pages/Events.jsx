import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";
import API     from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Btn } from "../components/UI.jsx";

const emptyForm = {
  name: "", location: "", date: "", description: "",
  capacity: "", status: "upcoming", ticketPrice: "", assignedTo: ""
};

const statusStyle = {
  upcoming: { bg: "rgba(37,99,235,0.15)",  border: "rgba(37,99,235,0.3)",  color: "#60a5fa" },
  live:     { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399" },
  selling:  { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24" },
  closed:   { bg: "rgba(100,116,139,0.15)",border: "rgba(100,116,139,0.3)",color: "#94a3b8" },
};

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
  <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "8px" }}>
    {children}
  </label>
);

const StyledInput = ({ value, onChange, type = "text", required, placeholder, rows }) => {
  const [focused, setFocused] = useState(false);
  const style = {
    ...glassInput,
    borderColor: focused ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.1)",
    boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.08)" : "none",
  };
  if (rows) return (
    <textarea value={value} onChange={onChange} rows={rows} style={{ ...style, resize: "vertical" }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
  );
  return (
    <input type={type} required={required} value={value} onChange={onChange} placeholder={placeholder}
      style={style} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
  );
};

const FormGrid = ({ formData, setFormData, onSubmit, loading, error, onCancel, submitLabel, isAdmin, managers }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
    {error && (
      <div style={{ gridColumn: "1/-1", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "12px 16px", borderRadius: "10px", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.5px" }}>
        ⚠ {error}
      </div>
    )}
    {[
      { label: "EVENT NAME",   key: "name",        type: "text",   required: true },
      { label: "LOCATION",     key: "location",    type: "text",   required: true },
      { label: "DATE",         key: "date",        type: "date",   required: true },
      { label: "CAPACITY",     key: "capacity",    type: "number", required: true },
      { label: "TICKET PRICE", key: "ticketPrice", type: "number", required: true },
    ].map(({ label, key, type, required }) => (
      <div key={key}>
        <FieldLabel>{label}</FieldLabel>
        <StyledInput type={type} required={required} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
      </div>
    ))}

    <div>
      <FieldLabel>STATUS</FieldLabel>
      <select 
        value={formData.status} 
        onChange={e => setFormData({ ...formData, status: e.target.value })} 
        style={{
          ...glassInput,
          background: "rgba(9, 9, 11, 0.9)", // Dark background for the collapsed select
          color: "white",
          cursor: "pointer",
          appearance: "none", // Removes default OS styling
        }}
      >
        {["upcoming", "live", "selling", "closed"].map(s => (
          <option 
            key={s} 
            value={s} 
            style={{ 
              background: "#1b1b1f", 
              color: "white",
              padding: "10px" 
            }}
          >
            {s.toUpperCase()}
          </option>
        ))}
      </select>
    </div>

    {isAdmin && (
      <div>
        <FieldLabel>ASSIGN TO MANAGER</FieldLabel>
          <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              style={{
                ...glassInput, // This applies your dark glass style
                background: "rgba(9, 9, 11, 0.9)", // Ensures the dropdown list itself is dark
                color: "white",
                appearance: "none", // Removes default browser styling
                cursor: "pointer"
              }}
            >
          <option value="">Select a manager</option>
          {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
    )}

    <div style={{ gridColumn: "1/-1" }}>
      <FieldLabel>DESCRIPTION</FieldLabel>
      <StyledInput value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
    </div>

    <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      <Btn onClick={onSubmit} disabled={loading}>{loading ? "Saving..." : submitLabel}</Btn>
    </div>
  </div>
);

// Cosmic modal wrapper
const CosmicModal = ({ title, subtitle, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: "20px",
  }}>
    <div style={{ position: "relative", width: "100%", maxWidth: "560px" }}>
      <div style={{
        position: "absolute", inset: "-1px", borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.3), rgba(6,182,212,0.15))",
        filter: "blur(1px)", zIndex: -1, animation: "pulseGlow 3.5s ease infinite",
      }} />
      <div style={{
        background: "rgba(6,6,15,0.97)",
        backdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 90px rgba(0,0,0,0.7)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>{subtitle?.toUpperCase()}</p>
            <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", letterSpacing: "2px", color: "var(--text)", margin: 0 }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "18px",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.target.style.color = "#f87171"; e.target.style.borderColor = "rgba(239,68,68,0.3)"; e.target.style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.35)"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
          >×</button>
        </div>
        <div style={{ padding: "24px 28px" }}>{children}</div>
      </div>
    </div>
  </div>
);

export default function Events() {
  const { user } = useAuth();
  const isAdmin  = user?.role === "admin";

  const [events,   setEvents]   = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(emptyForm);
  const [editEvent,   setEditEvent]   = useState(null);
  const [editForm,    setEditForm]    = useState(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editError,   setEditError]   = useState("");
  const [deleteId,    setDeleteId]    = useState(null);
  const [isDeleted,   setIsDeleted]   = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    API.get("/events")
      .then(res => setEvents(res.data))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    if (user?.role === "admin") {
      API.get("/users").then(res => setManagers(res.data.filter(u => u.role === "manager"))).catch(() => {});
    }
  }, []);

  const openEdit = (ev) => {
    setEditEvent(ev); setEditError("");
    setEditForm({
      name: ev.name || "", location: ev.location || "",
      date: ev.date ? ev.date.split("T")[0] : "",
      description: ev.description || "", capacity: ev.capacity || "",
      status: ev.status || "upcoming", ticketPrice: ev.ticketPrice || "",
      assignedTo: ev.createdBy || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setEditLoading(true); setEditError("");
    try {
      await API.put(`/events/update/${editEvent.id}`, {
        name: editForm.name, location: editForm.location, date: editForm.date,
        description: editForm.description, capacity: editForm.capacity,
        status: editForm.status, ticketPrice: editForm.ticketPrice,
      });
      if (editForm.assignedTo && editForm.assignedTo !== editEvent.createdBy) {
        await API.post(`/events/update/${editEvent.id}/assign`, { managerId: editForm.assignedTo });
      }
      setEditEvent(null); fetchEvents();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update event");
    } finally { setEditLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events/create-event", { ...form, createdBy: form.assignedTo });
      setShowForm(false); setError(""); setForm(emptyForm); fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/events/delete/${deleteId}`);
      setIsDeleted(true);
      setTimeout(() => { setDeleteId(null); setIsDeleted(false); fetchEvents(); }, 1000);
    } catch (err) {
      setError("Failed to delete event"); setDeleteId(null);
    } finally { setDeleteLoading(false); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#06060f", position: "relative" }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position: "fixed", borderRadius: "50%", background: "rgba(255,255,255,0.7)", width: s.size, height: s.size, left: s.left, top: s.top, opacity: s.opacity, pointerEvents: "none", zIndex: 0 }} />
      ))}
      <div style={{ position: "fixed", top: "15%", right: "15%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <Navbar title="Events" />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", marginBottom: "6px" }}>TOTAL</p>
              <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", letterSpacing: "2px", color: "var(--text)", margin: 0 }}>
                {events.length} <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "14px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>events</span>
              </p>
            </div>
            {isAdmin && (
              <Btn onClick={() => setShowForm(true)} variant="primary">+ New Event</Btn>
            )}
          </div>

          {error && !showForm && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "12px 16px", borderRadius: "10px", fontFamily: "'DM Mono', monospace", fontSize: "11px", marginBottom: "16px" }}>
              ⚠ {error}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: "54px", borderRadius: "10px" }} />)}
            </div>
          ) : (
            <div style={{ ...glassPanel, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Name","Location","Date","Capacity","Attendees","Fill Rate","Status","General","VIP",
                        ...(isAdmin ? ["Revenue","Assigned To","Actions"] : [])
                      ].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "'DM Mono', monospace", fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => {
                      const s = statusStyle[ev.status] || statusStyle.upcoming;
                      const fillRate = ev.capacity > 0 ? ((ev.attendees / ev.capacity) * 100).toFixed(1) : 0;
                      const fillColor = fillRate >= 80 ? "#10b981" : fillRate >= 50 ? "#f59e0b" : "rgba(255,255,255,0.25)";
                      const assignedManager = ev.assignedManagers?.[0] ?? null;
                      return (
                        <tr key={ev.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{ev.location}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{ev.capacity}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{ev.attendees}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "48px", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                                <div style={{ width: `${Math.min(fillRate, 100)}%`, height: "100%", background: fillColor, borderRadius: "2px", transition: "width 0.5s" }} />
                              </div>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: fillColor, fontWeight: 600 }}>{fillRate}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 500, letterSpacing: "1px", background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>{ev.status?.toUpperCase()}</span>
                          </td>
                          <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>${parseFloat(ev.ticketPrice).toFixed(2)}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#a78bfa" }}>${(parseFloat(ev.ticketPrice) * 2).toFixed(2)}</td>
                          {isAdmin && (
                            <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#34d399", fontWeight: 600 }}>
                              ${(ev.attendees * parseFloat(ev.ticketPrice)).toFixed(2)}
                            </td>
                          )}
                          {isAdmin && (
                            <td style={{ padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                              {assignedManager ? assignedManager.name : "—"}
                            </td>
                          )}
                          {isAdmin && (
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => openEdit(ev)} style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: 600, color: "#a78bfa", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.25)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.5px" }}
                                  onMouseEnter={e => e.target.style.background = "rgba(124,58,237,0.2)"}
                                  onMouseLeave={e => e.target.style.background = "rgba(124,58,237,0.1)"}>EDIT</button>
                                <button onClick={() => setDeleteId(ev.id)} style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: 600, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.5px" }}
                                  onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.2)"}
                                  onMouseLeave={e => e.target.style.background = "rgba(239,68,68,0.1)"}>DEL</button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Modal */}
      {showForm && isAdmin && (
        <CosmicModal title="Create New Event" subtitle="Action" onClose={() => { setShowForm(false); setForm(emptyForm); }}>
          <FormGrid formData={form} setFormData={setForm} onSubmit={handleSubmit} error={error}
            onCancel={() => { setShowForm(false); setForm(emptyForm); }} submitLabel="Create Event"
            isAdmin={isAdmin} managers={managers} />
        </CosmicModal>
      )}

      {/* Edit Modal */}
      {editEvent && (
        <CosmicModal title={editEvent.name} subtitle="Editing" onClose={() => setEditEvent(null)}>
          <FormGrid formData={editForm} setFormData={setEditForm} onSubmit={handleEditSubmit}
            loading={editLoading} error={editError} onCancel={() => setEditEvent(null)}
            submitLabel="Save Changes" isAdmin={isAdmin} managers={managers} />
        </CosmicModal>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "380px", padding: "0 20px" }}>
            <div style={{
              background: "rgba(6,6,15,0.97)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "20px", padding: "36px", textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(239,68,68,0.08)",
            }}>
              {!isDeleted ? (
                <>
                  <div style={{ width: "60px", height: "60px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px" }}>
                    🗑
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", letterSpacing: "2px", color: "var(--text)", marginBottom: "8px" }}>Delete Event?</h3>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "28px", lineHeight: "1.7", letterSpacing: "0.3px" }}>
                    This action cannot be undone. All data associated with this event will be permanently removed.
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
                      onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}>
                      Cancel
                    </button>
                    <button onClick={handleDelete} disabled={deleteLoading} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(239,68,68,0.3)", letterSpacing: "0.5px" }}>
                      {deleteLoading ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <div style={{ width: "60px", height: "60px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px", color: "#10b981" }}>✓</div>
                  <button style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", color: "#34d399", fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: "2px", cursor: "default" }}>
                    EVENT REMOVED
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