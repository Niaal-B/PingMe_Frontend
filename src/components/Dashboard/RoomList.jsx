import { Users, Loader, MessageCircle } from "lucide-react";

export const RoomList = ({ title,rooms, isFetchingRooms, onJoinRoom }) => {
  return (
    <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-teal-500 border-opacity-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-500 rounded-full p-2">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="ml-auto bg-teal-500 bg-opacity-30 text-teal-300 px-3 py-1 rounded-full text-sm font-semibold">
          {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"}
        </span>
      </div>

      {isFetchingRooms ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No rooms yet</p>
          <p className="text-gray-500 text-sm">
            Create your first room to get started!
          </p>
        </div>
      ) : (
<div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
{rooms.map((room) => (
            <div
              key={room.id}
              className="bg-black bg-opacity-5 hover:bg-opacity-10 rounded-lg p-4 border border-teal-500 border-opacity-20 hover:border-opacity-40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-teal-500 bg-opacity-30 rounded-lg p-2">
                    <MessageCircle className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {room.room_name}
                    </h4>
                    <p className="text-gray-400 text-sm">Room ID: {room.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => onJoinRoom(room.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
