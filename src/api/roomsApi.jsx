import axios from "./axiosInstance";

export const createRoom = async (roomName) => {
  const response = await axios.post("/rooms", { room_name: roomName });
  return response.data;
};


export const getRooms = async () => {
  const response = await axios.get("/rooms");
  return response.data;
};


export const getMyRooms = async () => {
  const response = await axios.get("/rooms/my");
  return response.data;
};


