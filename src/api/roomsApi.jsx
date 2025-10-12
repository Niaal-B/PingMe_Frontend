import axiosInstance from "./axiosInstance";

export const getRooms = async () => {
  const response = await axiosInstance.get("/rooms/");
  return response.data;
};

export const createRoom = async (roomName) => {
  const response = await axiosInstance.post("/rooms/", { name: roomName });
  return response.data;
};
