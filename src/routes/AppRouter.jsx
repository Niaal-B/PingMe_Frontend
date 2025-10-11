import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import PingMeDashboard from "../pages/Dashboard";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PingMeDashboard />} />

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </BrowserRouter>
);
