import { Plus, Loader } from "lucide-react";

export const CreateRoomForm = ({
  roomName,
  isLoading,
  message,
  onRoomNameChange,
  onCreateRoom,
}) => {
  return (
    <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500 border-opacity-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500 rounded-full p-2">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">Create New Room</h3>
      </div>

      <div className="mb-4">
        <label className="text-gray-300 text-sm block mb-2">Room Name</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => onRoomNameChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black text-white placeholder-gray-400 border border-teal-500 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          placeholder="Enter room name"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={onCreateRoom}
        disabled={isLoading || !roomName.trim()}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Create Room
          </>
        )}
      </button>

      {message.text && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            message.type === "error"
              ? "bg-red-500 bg-opacity-20 border border-red-500"
              : "bg-emerald-500 bg-opacity-20 border border-emerald-500"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              message.type === "error" ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {message.text}
          </p>
        </div>
      )}
    </div>
  );
};
