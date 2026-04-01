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
  upcoming: { bg: "rgba(37,99,235,0.15)",  border: "rgba(37,99,235,0.3)",  color: "#60a5fa"  },
  live:     { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399"  },
  selling:  { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24"  },
  closed:   { bg: "rgba(100,116,139,0.15)",border: "rgba(100,116,139,0.3)",color: "#94a3b8"  },
};

const FieldGroup = ({ label, children }) => (
  <div>
    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", padding: "11px 14px",
  background: "var(--surface2)", border: "1px solid var(--border)",
  borderRadius: "8px", color: "var(--text)",
  fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
  outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

//  Stable component definition outside
const StyledInput = ({ value, onChange, type = "text", required, placeholder, rows }) => {
  const [focused, setFocused] = useState(false);
  const style = { ...inputStyle, borderColor: focused ? "#2563eb" : "var(--border)", boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none" };
  if (rows) return (
    <textarea value={value} onChange={onChange} rows={rows} style={{ ...style, resize: "vertical" }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
  );
  return (
    <input type={type} required={required} value={value} onChange={onChange} placeholder={placeholder}
      style={style} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
  );
};

// accepts 'managers' as a prop
const ManagerDropdown = ({ value, onChange, managers }) => (
  <FieldGroup label="Assign to Manager">
    <select value={value} onChange={onChange} style={inputStyle} required>
      <option value="">Select a manager</option>
      {managers.map(m => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
  </FieldGroup>
);

//  accepts 'isAdmin' and 'managers' as props
const FormGrid = ({ formData, setFormData, onSubmit, loading, error, onCancel, submitLabel, isAdmin, managers }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
    {error && (
      <div style={{ gridColumn: "1/-1", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", fontSize: "13px" }}>
        {error}
      </div>
    )}
    {[
      { label: "Event Name",    key: "name",        type: "text",   required: true },
      { label: "Location",      key: "location",    type: "text",   required: true },
      { label: "Date",          key: "date",        type: "date",   required: true },
      { label: "Capacity",      key: "capacity",    type: "number", required: true },
      { label: "Ticket Price",  key: "ticketPrice", type: "number", required: true },
    ].map(({ label, key, type, required }) => (
      <FieldGroup key={key} label={label}>
        <StyledInput type={type} required={required} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
      </FieldGroup>
    ))}

    <FieldGroup label="Status">
      <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
        {["upcoming","live","selling","closed"].map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </FieldGroup>

    {isAdmin && (
      <ManagerDropdown
        value={formData.assignedTo}
        onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
        managers={managers}
      />
    )}

    <div style={{ gridColumn: "1/-1" }}>
      <FieldGroup label="Description">
        <StyledInput value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
      </FieldGroup>
    </div>

    <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
      <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      <Btn onClick={onSubmit} disabled={loading}>{loading ? "Saving..." : submitLabel}</Btn>
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
  const [editEvent,    setEditEvent]    = useState(null);
  const [editForm,     setEditForm]     = useState(emptyForm);
  const [editLoading,  setEditLoading]  = useState(false);
  const [editError,    setEditError]    = useState("");

  const fetchEvents = () => {
    setLoading(true);
    API.get("/events")
      .then(res => setEvents(res.data))
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    // fetch managers list for assignment dropdown (admin only)
    if (user?.role === "admin") {
      API.get("/users").then(res => {
        setManagers(res.data.filter(u => u.role === "manager"));
      }).catch(() => {});
    }
  }, []);

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
        assignedTo:  ev.createdBy || "",   
    });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError("");
        try {
            
            await API.put(`/events/update/${editEvent.id}`, {
            name:        editForm.name,
            location:    editForm.location,
            date:        editForm.date,
            description: editForm.description,
            capacity:    editForm.capacity,
            status:      editForm.status,
            ticketPrice: editForm.ticketPrice,
            });

            // 2. If manager changed — assign new manager
            if (editForm.assignedTo && editForm.assignedTo !== editEvent.createdBy) {
            await API.post(`/events/update/${editEvent.id}/assign`, {
                managerId: editForm.assignedTo,
            });
            }

            setEditEvent(null);
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
      await API.post("/events/create-event", {
        ...form,
        createdBy: form.assignedTo,  // send assignedTo as createdBy
      });
      setShowForm(false);setError(""); setForm(emptyForm); fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
      setTimeout(() => {setError("");} , 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try { await API.delete(`/events/delete/${id}`); fetchEvents(); }
    catch { setError("Failed to delete event"); }
  };





  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Events" />
        <main style={{ flex: 1, padding: "32px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <p style={{ fontSize: "24px", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "var(--text)" }}>
                {events.length} <span style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "'DM Sans'" }}>events</span>
              </p>
            </div>
            {isAdmin && (
              <Btn onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
                {showForm ? "✕ Cancel" : "+ New Event"}
              </Btn>
            )}
          </div>

          {/* Create Form */}
          {showForm && isAdmin && (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "16px", padding: "24px 28px", marginBottom: "24px",
            }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "20px", fontFamily: "'Sora', sans-serif" }}>Create New Event</p>
              <FormGrid
                formData={form} setFormData={setForm}
                onSubmit={handleSubmit} error={error}
                onCancel={() => { setShowForm(false); setForm(emptyForm); }}
                submitLabel="Create Event"
                isAdmin={isAdmin} 
                managers={managers} 
              />
            </div>
          )}

          {error && !showForm && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ height: "52px", borderRadius: "8px", background: "var(--surface2)", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                  <thead>
                    <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                      {["Name","Location","Date","Capacity","Attendees","Fill Rate","Status","General","VIP",
                        ...(isAdmin ? ["Revenue", "Assigned To", "Actions"] : [])
                      ].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1.5px", fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev, idx) => {
                      const s = statusStyle[ev.status] || statusStyle.upcoming;
                      const fillRate = ev.capacity > 0 ? ((ev.attendees / ev.capacity) * 100).toFixed(1) : 0;
                      const fillColor = fillRate >= 80 ? "#10b981" : fillRate >= 50 ? "#f59e0b" : "var(--muted)";
                      const assignedManager = ev.assignedManagers && ev.assignedManagers.length > 0 
                        ? ev.assignedManagers[0] 
                        : null;
                      return (
                        <tr key={ev.id}
                          style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{ev.name}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--muted)" }}>{ev.location}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--muted)" }}>{new Date(ev.date).toLocaleDateString()}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--muted)" }}>{ev.capacity}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--muted)" }}>{ev.attendees}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "48px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                                <div style={{ width: `${Math.min(fillRate, 100)}%`, height: "100%", background: fillColor, borderRadius: "2px", transition: "width 0.5s" }} />
                              </div>
                              <span style={{ fontSize: "12px", color: fillColor, fontWeight: 600 }}>{fillRate}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: "'Sora', sans-serif" }}>{ev.status.toUpperCase()}</span>
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>${parseFloat(ev.ticketPrice).toFixed(2)}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#a78bfa", fontWeight: 500 }}>${(parseFloat(ev.ticketPrice) * 2).toFixed(2)}</td>
                          {isAdmin && (
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "#10b981", fontWeight: 600 }}>
                              ${(ev.attendees * parseFloat(ev.ticketPrice)).toFixed(2)}
                            </td>
                          )}
                          {isAdmin && (
                            <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--muted)" }}>
                              {assignedManager ? assignedManager.name : "—"}
                            </td>
                          )}
                          {isAdmin && (
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => openEdit(ev)} style={{ fontSize: "11px", fontWeight: 600, color: "#60a5fa", background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s" }}
                                  onMouseEnter={e => e.target.style.background = "rgba(37,99,235,0.2)"}
                                  onMouseLeave={e => e.target.style.background = "rgba(37,99,235,0.1)"}>Edit</button>
                                <button onClick={() => handleDelete(ev.id)} style={{ fontSize: "11px", fontWeight: 600, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s" }}
                                  onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.2)"}
                                  onMouseLeave={e => e.target.style.background = "rgba(239,68,68,0.1)"}>Delete</button>
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

      {/* Edit Modal */}
      {editEvent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1px", fontWeight: 600 }}>EDITING</p>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--text)", margin: 0 }}>{editEvent.name}</h3>
              </div>
              <button onClick={() => setEditEvent(null)} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <FormGrid
                formData={editForm} setFormData={setEditForm}
                onSubmit={handleEditSubmit} loading={editLoading} error={editError}
                onCancel={() => setEditEvent(null)} submitLabel="Save Changes"
                isAdmin={isAdmin} // ✅ PASSING PROP
                managers={managers} // ✅ PASSING PROP
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}