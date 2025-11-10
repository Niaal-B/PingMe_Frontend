import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export const PublicRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/me");
        
        if (response.data && response.status === 200) {
          navigate("/dashboard", { replace: true });
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsValidating(false);
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, navigate]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 flex items-center justify-center">
        <div className="text-white text-lg">Checking authentication...</div>
      </div>
    );
  }

  return children;
};