// Step 1 - imports
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import Events     from "./pages/Events";
import Users      from "./pages/Users";
import Analytics  from "./pages/Analytics";
import Revenue    from "./pages/Revenue";
import Attendance from "./pages/Attendance";

// Step 2 - the component
export default function App() {
  return (
    // AuthProvider wraps everything so ALL pages can access who is logged in
    <AuthProvider>
      {/* BrowserRouter enables URL tracking */}
      <BrowserRouter>
        {/* Routes is the container for all route definitions */}
        <Routes>

          {/* Public route - anyone can visit login */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes - must be logged in */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>

          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }/>

          {/* Role protected - only admin and manager */}
          <Route path="/attendance" element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Attendance />
            </ProtectedRoute>
          }/>

          <Route path="/analytics" element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Analytics />
            </ProtectedRoute>
          }/>

          {/* Role protected - only admin */}
          <Route path="/revenue" element={
            <ProtectedRoute roles={["admin"]}>
              <Revenue />
            </ProtectedRoute>
          }/>

          <Route path="/users" element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }/>

          {/* If URL doesn't match anything, redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}