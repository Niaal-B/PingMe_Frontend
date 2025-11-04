import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Dashboard/Header";
import { WelcomeSection } from "../components/Dashboard/WelcomeSection";
import { CreateRoomForm } from "../components/Dashboard/CreateRoomForm";
import { RoomList } from "../components/Dashboard/RoomList";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRooms, setIsFetchingRooms] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsFetchingRooms(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ text: "Please log in to view rooms", type: "error" });
        return;
      }

      const response = await fetch("http://localhost:8000/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error("Fetch rooms error:", err);
      setMessage({ text: err.message || "Failed to load rooms", type: "error" });
    } finally {
      setIsFetchingRooms(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ text: "Please log in to create a room", type: "error" });
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/rooms", {
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
      fetchRooms();
    } catch (err) {
      setMessage({ text: err.message || "Something went wrong", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <Header onLogout={() => { logout(); navigate("/login"); }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={user} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CreateRoomForm
            roomName={roomName}
            isLoading={isLoading}
            message={message}
            onRoomNameChange={setRoomName}
            onCreateRoom={handleCreateRoom}
          />
          <RoomList
            rooms={rooms}
            isFetchingRooms={isFetchingRooms}
            onJoinRoom={(id) => navigate(`/chat/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
