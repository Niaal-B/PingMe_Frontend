import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle, Send, ArrowLeft, Users } from "lucide-react";

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/rooms/${roomId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Received:", data);
      
      // Handle different message types
      if (data.type === "history") {
        // Load message history
        const historyMessages = data.payload || [];
        setMessages((prev) => {
          // Avoid duplicates by checking if we already have messages
          if (prev.length === 0) {
            return historyMessages.map(msg => ({
              type: "message",
              payload: msg
            }));
          }
          return prev;
        });
      } else if (data.type === "join" || data.type === "leave") {
        // Add join/leave messages to the chat
        setMessages((prev) => [...prev, data]);
      } else if (data.type === "message") {
        // Add regular chat messages
        setMessages((prev) => [...prev, data]);
      } else if (data.type === "typing_start") {
        // Add user to typing list
        setTypingUsers((prev) => {
          const userInfo = {
            sender_id: data.payload.sender_id,
            sender_name: data.payload.sender_name
          };
          // Check if user is already in the list
          if (!prev.find(u => u.sender_id === userInfo.sender_id)) {
            return [...prev, userInfo];
          }
          return prev;
        });
        // Auto-remove typing indicator after 1.5 seconds
        if (typingStopTimeoutRef.current) {
          clearTimeout(typingStopTimeoutRef.current);
        }
        typingStopTimeoutRef.current = setTimeout(() => {
          setTypingUsers((prev) => prev.filter(u => u.sender_id !== data.payload.sender_id));
        }, 1500);
      } else if (data.type === "typing_stop") {
        // Remove user from typing list
        setTypingUsers((prev) => prev.filter(u => u.sender_id !== data.payload.sender_id));
        if (typingStopTimeoutRef.current) {
          clearTimeout(typingStopTimeoutRef.current);
        }
      } else if (data.type === "error") {
        console.error("WebSocket error:", data.payload);
      }
    };
    
    ws.onclose = () => {
      console.log("❌ WebSocket closed");
      setIsConnected(false);
    };

    return () => {
      ws.close();
      // Clean up typing timeouts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
      }
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendTypingStart = () => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: "typing_start"
      }));
    }
  };

  const sendTypingStop = () => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: "typing_stop"
      }));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing_stop if input is empty
    if (value.trim() === "") {
      sendTypingStop();
      return;
    }

    // Send typing_start after 300ms of no typing
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStart();
    }, 300);
  };

  const sendMessage = (e) => {
    e?.preventDefault();
    if (wsRef.current && input.trim() !== "") {
      // Send typing_stop before sending message
      sendTypingStop();
      
      wsRef.current.send(JSON.stringify({
        type: "message",
        payload: { content: input }
      }));
      setInput("");
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Helper function to render message content
  const renderMessageContent = (msg) => {
    if (msg.type === "join") {
      return (
        <div className="text-center py-2">
          <span className="text-teal-400 text-sm italic">
            {msg.payload?.sender_name || "Someone"} joined the room
          </span>
        </div>
      );
    }
    
    if (msg.type === "leave") {
      return (
        <div className="text-center py-2">
          <span className="text-gray-400 text-sm italic">
            {msg.payload?.sender_name || "Someone"} left the room
          </span>
        </div>
      );
    }
    
    // Regular message
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-teal-500/20 hover:border-teal-500/40 transition-all shadow-lg hover:shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full p-2 min-w-[36px] h-9 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">
              {(msg.payload?.sender_name || "System")[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-emerald-300 text-sm">
                {msg.payload?.sender_name || "System"}
              </span>
              <span className="text-gray-500 text-xs">
                {msg.payload?.timestamp 
                  ? new Date(msg.payload.timestamp).toLocaleTimeString()
                  : new Date().toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed break-words">
              {msg.payload?.content || ""}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl border border-teal-500/30 shadow-2xl flex flex-col h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-teal-500/30 bg-black/30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-black/40 hover:bg-black/60 backdrop-blur-sm p-2 rounded-xl border border-teal-500/30 transition-all transform hover:scale-110 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl p-2.5 shadow-lg shadow-teal-500/50">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Room {roomId}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <p className="text-xs text-gray-400">{isConnected ? 'Connected' : 'Disconnected'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-teal-500/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-teal-500/30">
              <Users className="w-4 h-4 text-teal-300" />
              <span className="text-teal-300 text-sm font-medium">Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide p-6 bg-gradient-to-b from-black/20 to-black/40">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-teal-500/10 rounded-full p-6 mb-4">
                  <MessageCircle className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No messages yet</p>
                <p className="text-gray-500 text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i}>
                  {renderMessageContent(msg)}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="px-6 py-2 border-t border-teal-500/20 bg-black/20">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm italic">
                  {typingUsers.length === 1
                    ? `${typingUsers[0].sender_name} is typing`
                    : typingUsers.length === 2
                    ? `${typingUsers[0].sender_name} and ${typingUsers[1].sender_name} are typing`
                    : `${typingUsers[0].sender_name} and ${typingUsers.length - 1} others are typing`}
                </span>
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-teal-500/30 bg-black/30">
            <form onSubmit={sendMessage} className="flex items-center gap-3">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 px-5 py-3.5 rounded-xl bg-black/40 backdrop-blur-sm text-white placeholder-gray-400 border-2 border-teal-500/30 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-lg"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!isConnected || input.trim() === ""}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}