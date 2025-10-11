import axiosInstance from "./axiosInstance";

const API_BASE_URL = "http://localhost:8000"; 

export const getDashboardData = async () => {
    const response = await axiosInstance.get("/dashboard")
    return response.data;
  };