// src/pages/ChatRoom.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, LogOut, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Component for a single chat message
const ChatMessage = ({ message }) => {
  const isStatus = message.type === 'status';
  const isMyMessage = message.user_id === parseInt(localStorage.getItem('userId')); // Assuming you store userId
  
  // Note: For a real app, ensure you store the user ID on login.
  // For this example, we assume userId is set after successful login.
  const myUserId = 1; // Placeholder: Replace with actual user ID from state/storage
  const isSender = message.user_id === myUserId;

  if (isStatus) {
    return (
      <div className="text-center text-sm text-yellow-300 italic py-2">
        — {message.content} —
      </div>
    );
  }

  return (
    <div className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-lg ${
          isSender
            ? 'bg-emerald-600 text-white rounded-br-none'
            : 'bg-gray-700 text-white rounded-tl-none'
        }`}
      >
        <span className={`block font-semibold text-xs mb-1 ${isSender ? 'text-emerald-100' : 'text-emerald-400'}`}>
          {isSender ? 'You' : message.username}
        </span>
        <p>{message.content}</p>
      </div>
    </div>
  );
};


const ChatRoom = () => {
  const { roomId } = useParams(); // Get room ID from the URL (e.g., /chat/123)
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  
  // Ref to hold the mutable WebSocket object
  const ws = useRef(null); 
  // Ref to keep the message list scrolled to the bottom
  const messagesEndRef = useRef(null); 
  
  // Get the token from local storage
  const accessToken = localStorage.getItem('accessToken');
  
  // --- WebSocket Connection Logic (useEffect) ---
  useEffect(() => {
    if (!accessToken) {
      setConnectionStatus('Authentication Failed.');
      return; 
    }

    // Determine the correct WebSocket URL
    // Use the host from the window location, replacing 'http' with 'ws' or 'https' with 'wss'
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host.split(':')[0]; // Get only the hostname
    const port = 8000; // Your backend port
    
    // The final WebSocket URL, including the room ID and the JWT token
    const WS_URL = `${protocol}://${host}:${port}/ws/chat/${roomId}?token=${accessToken}`;

    // Initialize the WebSocket connection
    ws.current = new WebSocket(WS_URL);

    // --- WebSocket Event Handlers ---
    ws.current.onopen = () => {
      setConnectionStatus('Connected');
      console.log('WebSocket connected successfully.');
    };

    ws.current.onmessage = (event) => {
        console.log('--- RECEIVED MESSAGE ---', event.data); // CRITICAL: Ensure this log runs
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.current.onclose = (event) => {
      setConnectionStatus('Disconnected');
      console.log('WebSocket closed:', event.code, event.reason);
      if (event.code === 1008 || event.code === 1000) {
        // Code 1008 is Policy Violation (our security code); 1000 is normal close
        if (event.code === 1008) {
            alert('Your session expired or token is invalid. Please log in again.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
      }
    };

    ws.current.onerror = (error) => {
      setConnectionStatus('Connection Error');
      console.error('WebSocket Error:', error);
    };

    // --- Cleanup Function (Runs when component unmounts) ---
    return () => {
      if (ws.current) {
        ws.current.close(); // Close the WebSocket connection cleanly
      }
    };
  }, [roomId, accessToken, navigate]); // Dependencies: Re-run if room ID or token changes

  // --- Auto-Scroll to Bottom Effect ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Message Sending Function ---
  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }
    
    // The backend expects a raw string (the message content)
    ws.current.send(inputMessage.trim()); 
    setInputMessage('');
  };

  const handleLeaveRoom = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.close(1000, "User left the room");
      }
      navigate('/dashboard');
  }

  // --- Render Logic ---
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header Bar */}
      <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-emerald-700 shadow-md">
        <h1 className="text-xl font-bold text-emerald-400">
          Room: {roomId} 
          <span className={`text-sm ml-3 font-normal ${connectionStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
            {connectionStatus} 
          </span>
          {connectionStatus === 'Connecting...' && <Loader2 className="w-4 h-4 inline ml-2 animate-spin" />}
        </h1>
        <button
          onClick={handleLeaveRoom}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" /> Leave
        </button>
      </header>

      {/* Message Area */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} /> {/* Scroller reference */}
        </div>
      </main>

      {/* Input Form */}
      <footer className="p-4 bg-gray-900 border-t border-emerald-700">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={connectionStatus !== 'Connected'}
              className="flex-1 p-3 bg-gray-800 border border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            />
            <button
              type="submit"
              disabled={connectionStatus !== 'Connected' || inputMessage.trim() === ''}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition disabled:bg-gray-600 disabled:text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoom;