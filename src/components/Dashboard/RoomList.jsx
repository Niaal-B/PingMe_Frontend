import { Users, Loader, MessageCircle, ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RoomList = ({ title, rooms, isFetchingRooms, onDeleteRoom, onJoinRoom }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-6 border border-teal-500/30 shadow-2xl hover:border-teal-500/50 transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl p-2.5 shadow-lg shadow-teal-500/50">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white flex-1">{title}</h3>
          <span className="bg-teal-500/20 backdrop-blur-sm text-teal-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-teal-500/30 shadow-lg">
            {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"}
          </span>
        </div>

        {isFetchingRooms ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-10 h-10 text-teal-400 animate-spin" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-teal-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-300 text-lg mb-2 font-medium">No rooms yet</p>
            <p className="text-gray-500 text-sm">
              Create your first room to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide pr-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/40 rounded-xl p-4 border border-teal-500/20 hover:border-teal-500/40 transition-all shadow-lg hover:shadow-xl group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-teal-500/20 rounded-xl p-2.5 border border-teal-500/30 group-hover:bg-teal-500/30 transition-all">
                      <MessageCircle className="w-5 h-5 text-teal-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white font-semibold truncate">
                        {room.room_name}
                      </h4>
                      <p className="text-gray-400 text-xs">ID: {room.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onJoinRoom && (
                      <button
                        onClick={() => onJoinRoom(room.id)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                      >
                        Join
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteRoom && (
                      <button
                        onClick={() => onDeleteRoom(room.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105 active:scale-95"
                        title="Delete room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};