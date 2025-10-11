const Toast = ({ message, type = "error", onClose }) => {
    if (!message) return null;
  
    const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
  
    return (
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg fixed top-6 right-6 z-50 animate-slide-in`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-4 font-bold text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };
  