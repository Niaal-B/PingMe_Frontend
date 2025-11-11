import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Dashboard/Header";
import { WelcomeSection } from "../components/Dashboard/WelcomeSection";
import { CreateRoomForm } from "../components/Dashboard/CreateRoomForm";
import { RoomList } from "../components/Dashboard/RoomList";
import { getRooms, getMyRooms } from "../api/roomsApi";
import axios from "../api/axiosInstance";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRooms, setIsFetchingRooms] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getRooms();
        const myRoomsData = await getMyRooms();
        setRooms(allRooms);
        setMyRooms(myRoomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsFetchingRooms(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMessage({ text: "Please log in to create a room", type: "error" });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_name: roomName }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to create room");

      setMessage({ text: "Room created successfully!", type: "success" });
      setRoomName("");
      getMyRooms().then(setMyRooms);
      
    } catch (err) {
      setMessage({ text: err.message || "Something went wrong", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`/rooms/${roomId}`);
      setMyRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        <Header onLogout={() => { logout(); navigate("/login"); }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WelcomeSection user={user} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CreateRoomForm
              roomName={roomName}
              isLoading={isLoading}
              message={message}
              onRoomNameChange={setRoomName}
              onCreateRoom={handleCreateRoom}
            />
            <RoomList
              title="Available Rooms"
              rooms={rooms}
              isFetchingRooms={isFetchingRooms}
              onJoinRoom={(id) => navigate(`/rooms/${id}`)}            />
            <RoomList
              title="My Rooms"
              rooms={myRooms}
              isFetchingRooms={isFetchingRooms}
              onJoinRoom={(id) => navigate(`/rooms/${id}`)}
              onDeleteRoom={handleDeleteRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;