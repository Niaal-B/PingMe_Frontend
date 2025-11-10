import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle, Send, ArrowLeft, Users, Smile } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import EmojiPicker from 'emoji-picker-react';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);
  const currentUserIdRef = useRef(user?.id);
  const lastJoinLeaveRef = useRef({}); // Track last join/leave message per user
  const pendingLeaveRef = useRef({}); // Track pending leave messages that might be reconnections
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Update user ID ref when user changes
  useEffect(() => {
    currentUserIdRef.current = user?.id;
  }, [user]);

  // Handle click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        // Check if click is on the emoji button
        const emojiButton = event.target.closest('button[aria-label="Toggle emoji picker"]');
        if (!emojiButton) {
          setShowEmojiPicker(false);
        }
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const wsUrl = apiUrl.replace("http://", "ws://").replace("https://", "wss://");
    const ws = new WebSocket(`${wsUrl}/ws/rooms/${roomId}?token=${token}`);
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
        // Add join/leave messages to the chat, but filter out current user's own messages
        if (currentUserIdRef.current && data.payload?.sender_id && data.payload.sender_id !== currentUserIdRef.current) {
          const userId = data.payload.sender_id;
          const messageType = data.type;
          const now = Date.now();
          
          // If this is a leave message, check if there's a pending leave for this user
          if (messageType === "leave") {
            // Store this leave message temporarily
            pendingLeaveRef.current[userId] = {
              data: data,
              timestamp: now
            };
            
            // Set a timeout to show the leave if no join comes within 3 seconds
            setTimeout(() => {
              const pending = pendingLeaveRef.current[userId];
              if (pending && pending.data === data) {
                // No join came, so this is a real leave
                const lastMessage = lastJoinLeaveRef.current[userId];
                if (!lastMessage || lastMessage.type !== "leave" || (now - lastMessage.timestamp) >= 2000) {
                  lastJoinLeaveRef.current[userId] = {
                    type: "leave",
                    timestamp: now
                  };
                  setMessages((prev) => [...prev, data]);
                }
                delete pendingLeaveRef.current[userId];
              }
            }, 3000);
            return; // Don't show leave immediately
          }
          
          // If this is a join message
          if (messageType === "join") {
            // Cancel any pending leave for this user (it was just a reconnection)
            if (pendingLeaveRef.current[userId]) {
              delete pendingLeaveRef.current[userId];
              // Don't show the leave, it was just a reconnection
            }
            
            // Check if we've seen this exact message recently (within 2 seconds)
            const lastMessage = lastJoinLeaveRef.current[userId];
            if (lastMessage && 
                lastMessage.type === "join" && 
                (now - lastMessage.timestamp) < 2000) {
              // Skip duplicate join message
              console.log("Skipping duplicate join for user", userId);
              return;
            }
            
            // Update last seen message
            lastJoinLeaveRef.current[userId] = {
              type: "join",
              timestamp: now
            };
            
            setMessages((prev) => [...prev, data]);
          }
        }
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

  const onEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    // Focus back on input
    setTimeout(() => {
      const inputElement = document.querySelector('input[placeholder*="Type your message"]');
      if (inputElement) inputElement.focus();
    }, 0);
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
      setShowEmojiPicker(false);
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const isOwnMessage = (msg) => {
    return currentUserIdRef.current && msg.payload?.sender_id === currentUserIdRef.current;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (msg, index) => {
    if (msg.type === "join") {
      return (
        <div className="flex items-center justify-center py-3 my-2">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 rounded-full border border-teal-500/20">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-teal-300 text-xs font-medium">
              {msg.payload?.sender_name || "Someone"} joined
            </span>
          </div>
        </div>
      );
    }
    
    if (msg.type === "leave") {
      return (
        <div className="flex items-center justify-center py-3 my-2">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-500/10 rounded-full border border-gray-500/20">
            <span className="text-gray-400 text-xs font-medium">
              {msg.payload?.sender_name || "Someone"} left
            </span>
          </div>
        </div>
      );
    }
    
    // Regular message
    const ownMessage = isOwnMessage(msg);
    const showAvatar = index === 0 || 
      messages[index - 1]?.type !== "message" || 
      messages[index - 1]?.payload?.sender_id !== msg.payload?.sender_id;
    
    return (
      <div className={`flex items-end gap-2 group ${ownMessage ? 'justify-end' : 'justify-start'} mb-1`}>
        {!ownMessage && showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-teal-500/30">
            <span className="text-white text-xs font-bold">
              {(msg.payload?.sender_name || "System")[0].toUpperCase()}
            </span>
          </div>
        )}
        {!ownMessage && !showAvatar && <div className="w-8"></div>}
        
        <div className={`flex flex-col max-w-[70%] ${ownMessage ? 'items-end' : 'items-start'}`}>
          {!ownMessage && showAvatar && (
            <span className="text-xs text-gray-400 mb-1 px-2 font-medium">
              {msg.payload?.sender_name || "System"}
            </span>
          )}
          <div className={`relative px-4 py-2.5 rounded-2xl shadow-lg transition-all duration-200 ${
            ownMessage 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-md' 
              : 'bg-black/60 backdrop-blur-sm border border-teal-500/20 text-gray-100 rounded-bl-md hover:border-teal-500/40'
          }`}>
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {msg.payload?.content || ""}
            </p>
            <div className={`flex items-center gap-1.5 mt-1.5 ${ownMessage ? 'justify-end' : 'justify-start'}`}>
              <span className={`text-xs ${ownMessage ? 'text-emerald-50/70' : 'text-gray-400'}`}>
                {formatTime(msg.payload?.timestamp)}
              </span>
            </div>
          </div>
        </div>
        
        {ownMessage && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-emerald-500/30">
            <span className="text-white text-xs font-bold">
              {(user?.username || "You")[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full h-screen px-2 sm:px-4 py-2 sm:py-4 relative z-10">
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-teal-500/30 shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-teal-500/20 bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-black/40 hover:bg-black/60 backdrop-blur-sm p-2.5 rounded-xl border border-teal-500/30 transition-all transform hover:scale-110 active:scale-95 hover:border-teal-500/50"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500/20 rounded-xl blur-lg"></div>
                <div className="relative bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl p-2.5 shadow-lg shadow-teal-500/50">
                <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Room {roomId}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' : 'bg-red-400'}`}></div>
                  <p className="text-xs text-gray-400 font-medium">{isConnected ? 'Connected' : 'Disconnected'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-teal-500/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-teal-500/30 hover:border-teal-500/50 transition-colors">
              <Users className="w-4 h-4 text-teal-300" />
              <span className="text-teal-300 text-sm font-medium">Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-black/20 via-black/30 to-black/40 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full p-8 border border-teal-500/30">
                    <MessageCircle className="w-16 h-16 text-teal-400" />
                  </div>
                </div>
                <h3 className="text-gray-300 text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-gray-500 text-sm max-w-sm">Be the first to start the conversation in this room!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.map((msg, i) => (
                  <div key={i} className="animate-fade-in">
                    {renderMessageContent(msg, i)}
                  </div>
                ))}
                </div>
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
          <div className="p-4 border-t border-teal-500/20 bg-gradient-to-b from-black/40 to-black/50 backdrop-blur-xl">
            <form onSubmit={sendMessage} className="flex items-end gap-3">
              <div className="flex-1 relative">
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute bottom-full right-0 mb-2 z-50 rounded-2xl overflow-hidden shadow-2xl border border-teal-500/30">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      theme="dark"
                      width={350}
                      height={400}
                      previewConfig={{ showPreview: false }}
                      skinTonesDisabled
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    aria-label="Toggle emoji picker"
                    className={`p-2.5 rounded-xl border transition-all ${
                      showEmojiPicker
                        ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                        : 'bg-black/40 hover:bg-black/60 border-teal-500/30 hover:border-teal-500/50 text-gray-400 hover:text-teal-400'
                    }`}
                    disabled={!isConnected}
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  
              <input
                value={input}
                    onChange={handleInputChange}
                    placeholder={isConnected ? "Type your message..." : "Connecting..."}
                    className="flex-1 px-5 py-3.5 pr-12 rounded-2xl bg-black/50 backdrop-blur-sm text-white placeholder-gray-500 border-2 border-teal-500/20 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isConnected}
              />
                </div>
                
                {input.trim() && (
                  <div className="absolute right-3 bottom-3.5 text-xs text-gray-500">
                    Press Enter to send
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!isConnected || input.trim() === ""}
                className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-3.5 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px] h-[48px] transform hover:scale-105 active:scale-95 disabled:transform-none group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="sr-only">Send message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}