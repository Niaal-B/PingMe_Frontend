import React, { useState } from "react";
import { createRoom } from "../api/roomsApi";

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await createRoom(roomName);
      onRoomCreated(data); // notify dashboard to update
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-emerald-900 p-6 rounded-2xl shadow-2xl w-96">
        <h2 className="text-xl font-bold mb-4 text-emerald-300">Create a New Room</h2>

        <form onSubmit={handleCreate}>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            required
            className="w-full px-4 py-2 rounded-lg mb-4 bg-emerald-800 text-white border border-emerald-700"
          />

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-semibold hover:bg-emerald-400 transition"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
