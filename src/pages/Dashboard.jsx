import { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboardApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (error) {
        toast.error("Failed to fetch dashboard data", {
          description: error.response?.data?.detail || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">Logout</button>

      {data ? (
        <pre className="bg-gray-800 text-white p-4 rounded-xl shadow-lg">
          Welcome {data.username}
        </pre>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}