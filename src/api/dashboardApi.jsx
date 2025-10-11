import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; 

export const getDashboardData = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };