import React, { useState, useEffect } from "react";
import { Plus, LogIn, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getRooms } from "../api/roomsApi";
import CreateRoomModal from "../components/CreateRoomModal";

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreated = (newRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-teal-900 to-emerald-950 text-white flex flex-col items-center p-6">
      <header className="w-full max-w-6xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-emerald-400">PingMe Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 rounded-xl transition"
          >
            <Plus className="w-5 h-5" /> Create Room
          </button>

          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-xl transition"
          >
            <LogIn className="w-5 h-5" /> Join Room
          </button>
        </div>
      </header>

      <div className="w-full max-w-6xl">
        <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>

        {loading ? (
          <p className="text-gray-400">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <p>No rooms available yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 bg-emerald-900/40 border border-emerald-800 rounded-2xl shadow-lg hover:shadow-emerald-700/30 transition"
              >
                <h3 className="text-lg font-bold mb-1 text-emerald-300">{room.name}</h3>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg transition">
                  Join Chat
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateRoomModal
          onClose={() => setIsCreateModalOpen(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
