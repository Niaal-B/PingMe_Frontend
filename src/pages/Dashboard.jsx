import React, { useState } from 'react';
import { MessageCircle, Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Settings, User, LogOut, Users, Bell } from 'lucide-react';

const contacts = [
  { id: 1, name: 'Sarah Chen', avatar: 'S', status: 'online', lastMessage: 'See you tomorrow!', time: '2m ago', unread: 2, color: 'bg-blue-400' },
  { id: 2, name: 'Michael Brown', avatar: 'M', status: 'online', lastMessage: 'Thanks for the help 👍', time: '15m ago', unread: 0, color: 'bg-purple-400' },
  { id: 3, name: 'Emily Watson', avatar: 'E', status: 'away', lastMessage: 'Can we reschedule?', time: '1h ago', unread: 1, color: 'bg-pink-400' },
  { id: 4, name: 'Alex Rivera', avatar: 'A', status: 'offline', lastMessage: 'The project looks great!', time: '2h ago', unread: 0, color: 'bg-yellow-400' },
  { id: 5, name: 'David Kim', avatar: 'D', status: 'online', lastMessage: 'Let me check and get back', time: '3h ago', unread: 0, color: 'bg-emerald-400' },
  { id: 6, name: 'Lisa Anderson', avatar: 'L', status: 'offline', lastMessage: 'Perfect! Will do.', time: '5h ago', unread: 0, color: 'bg-red-400' },
];

const PingMeDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [message, setMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  
  const messages = [
    { id: 1, sender: 'them', text: 'Hey! How are you doing?', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Hi! I\'m doing great, thanks for asking!', time: '10:32 AM' },
    { id: 3, sender: 'them', text: 'That\'s awesome! Are we still on for tomorrow?', time: '10:33 AM' },
    { id: 4, sender: 'me', text: 'Yes, absolutely! Looking forward to it.', time: '10:35 AM' },
    { id: 5, sender: 'them', text: 'See you tomorrow!', time: '10:36 AM' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-black rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex">
        
        {/* Sidebar */}
        <div className="w-80 bg-gray-900 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-emerald-500" />
                <h1 className="text-white text-xl font-bold">PingMe</h1>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedChat(contact)}
                className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                  selectedChat.id === contact.id ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center text-white font-bold`}>
                      {contact.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      contact.status === 'online' ? 'bg-green-500' : contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-semibold text-sm">{contact.name}</h3>
                      <span className="text-gray-500 text-xs">{contact.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm truncate">{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-900 border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 ${selectedChat.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {selectedChat.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                    selectedChat.status === 'online' ? 'bg-green-500' : selectedChat.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                <div>
                  <h2 className="text-white font-semibold">{selectedChat.name}</h2>
                  <p className="text-gray-400 text-sm capitalize">{selectedChat.status}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md ${msg.sender === 'me' ? 'bg-emerald-500' : 'bg-gray-800'} rounded-2xl px-4 py-2`}>
                  <p className="text-white text-sm">{msg.text}</p>
                  <span className="text-xs text-gray-300 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-gray-900 border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Mic className="w-5 h-5 text-gray-400" />
              </button>
              <button 
                onClick={handleSendMessage}
                className="bg-emerald-500 hover:bg-emerald-600 p-3 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Sidebar (Optional) */}
        {showProfile && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-24 h-24 ${selectedChat.color} rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4`}>
                {selectedChat.avatar}
              </div>
              <h2 className="text-white text-xl font-bold mb-1">{selectedChat.name}</h2>
              <p className="text-gray-400 text-sm capitalize">{selectedChat.status}</p>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-left">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white">View Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-left">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-white">Create Group</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-left">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-white">Notifications</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-left">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-white">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-left text-red-500">
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Shared Media</h3>
              <p className="text-gray-400 text-sm">No media shared yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PingMeDashboard;