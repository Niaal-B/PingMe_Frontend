import { Plus, Loader, Sparkles } from "lucide-react";

export const CreateRoomForm = ({
  roomName,
  isLoading,
  message,
  onRoomNameChange,
  onCreateRoom,
}) => {
  return (
    <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/30 shadow-2xl hover:border-emerald-500/50 transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-2.5 shadow-lg shadow-emerald-500/50">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Create New Room</h3>
        </div>

        <form onSubmit={onCreateRoom} className="space-y-5">
          <div>
            <label className="text-gray-200 text-sm font-medium block mb-2">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => onRoomNameChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 text-white placeholder-gray-400 border-2 border-teal-500/30 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-lg backdrop-blur-sm"
              placeholder="Enter room name"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !roomName.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
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
        </form>

        {message.text && (
          <div
            className={`mt-4 p-4 rounded-xl backdrop-blur-sm border shadow-lg ${
              message.type === "error"
                ? "bg-red-500/20 border-red-500/50"
                : "bg-emerald-500/20 border-emerald-500/50"
            }`}
          >
            <p className={`text-sm font-medium ${message.type === "error" ? "text-red-200" : "text-emerald-200"}`}>
              {message.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};