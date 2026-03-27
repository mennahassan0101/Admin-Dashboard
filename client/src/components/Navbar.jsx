import { useAuth } from "../context/AuthContext";

export default function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <div className="text-sm text-gray-500">
        Logged in as <span className="font-medium text-gray-800">{user?.name}</span>
      </div>
    </header>
  );
}