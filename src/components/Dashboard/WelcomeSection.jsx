import { Sparkles, User } from "lucide-react";

export const WelcomeSection = ({ user }) => {
    return (
      <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-3 shadow-lg shadow-emerald-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{user?.username || "User"}</span>!
              </h2>
              <p className="text-gray-300">Ready to connect with your team?</p>
            </div>
          </div>
          {user && (
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-emerald-500/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-emerald-500/30 shadow-lg hover:bg-emerald-500/15 transition-all">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-300 font-semibold text-sm">Email:</span>
                </div>
                <span className="text-white ml-6 text-sm">{user.email}</span>
              </div>
              <div className="bg-teal-500/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-teal-500/30 shadow-lg hover:bg-teal-500/15 transition-all">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-300" />
                  <span className="text-teal-300 font-semibold text-sm">Username:</span>
                </div>
                <span className="text-white ml-6 text-sm">{user.username}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };