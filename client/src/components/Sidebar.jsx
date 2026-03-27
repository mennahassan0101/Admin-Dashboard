import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard",  label: "Dashboard",  roles: ["admin", "manager"] }, 
  { to: "/events",     label: "Events",      roles: ["admin", "manager"] },
  { to: "/attendance", label: "Attendance",  roles: ["admin", "manager"] },
  { to: "/analytics",  label: "Analytics",   roles: ["admin", "manager"] },
  { to: "/revenue",    label: "Revenue",     roles: ["admin"] },
  { to: "/users",      label: "Users",       roles: ["admin"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">Admin Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">{user?.name} · {user?.role}</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links
          .filter(link => link.roles.includes(user?.role))
          .map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}