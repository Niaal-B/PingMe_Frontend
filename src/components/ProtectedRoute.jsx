import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getDashboardData } from "../api/dashboardApi";

export const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); 
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const user = await getDashboardData(token);
        console.log(user, " Valid user data");
        setIsValid(true);
      } catch (error) {
        console.log("Invalid token or fetch failed:", error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isValid === null) {
    return <div className="text-center mt-10 text-gray-600">Checking session...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};