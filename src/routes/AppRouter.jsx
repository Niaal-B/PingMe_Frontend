import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import PingMeDashboard from "../pages/Dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute";
import ChatRoom from "../pages/ChatRoom";
import PrivateRoute from "../auth/PrivateRoute";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<PublicRoute><Login/></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><PingMeDashboard /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </BrowserRouter>
);
