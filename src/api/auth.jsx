import axios from "axios";
import { API_BASE_URL } from "../config"; 

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);  
    return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  const { access_token, refresh_token } = response.data;
  localStorage.setItem("accessToken", access_token);
  localStorage.setItem("refreshToken", refresh_token);  
  return response.data;
};
