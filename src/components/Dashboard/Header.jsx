import { MessageCircle, LogOut, Sparkles } from "lucide-react";

export const Header = ({ onLogout }) => {
  return (
    <div className="bg-black/50 backdrop-blur-xl border-b border-teal-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-2.5 shadow-lg shadow-emerald-500/50">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                PingMe
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Real-time messaging</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105 active:scale-95 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};