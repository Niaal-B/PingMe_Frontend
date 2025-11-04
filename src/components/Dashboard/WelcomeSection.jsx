export const WelcomeSection = ({ user }) => {
    return (
      <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-teal-500 border-opacity-20">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.username || "User"}!
        </h2>
        <p className="text-gray-300 mb-4">Ready to connect with your team?</p>
        {user && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-teal-500 bg-opacity-20 px-4 py-2 rounded-lg border border-teal-500 border-opacity-30">
              <span className="text-teal-300 font-semibold">Email:</span>
              <span className="text-white ml-2">{user.email}</span>
            </div>
            <div className="bg-emerald-500 bg-opacity-20 px-4 py-2 rounded-lg border border-emerald-500 border-opacity-30">
              <span className="text-emerald-300 font-semibold">Username:</span>
              <span className="text-white ml-2">{user.username}</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  