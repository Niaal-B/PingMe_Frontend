import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import PingMeDashboard from "../pages/Dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><PingMeDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </BrowserRouter>
);
