import { useState, useEffect } from "react";

const Chatbot = () => {
  const [questions, setQuestions] = useState([]);
  const [chat, setChat] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Fetch questions from API
    fetch("http://127.0.0.1:8000/api/chatbot-qa/")
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error("Error fetching chatbot Q&A:", error));
  }, []);

  const handleQuestionClick = (question, answer) => {
    // Add user question to chat
    setChat([...chat, { type: "user", text: question }]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Add bot response after a short delay to simulate typing
    setTimeout(() => {
      setIsTyping(false);
      setChat(prevChat => [...prevChat, { type: "bot", text: answer }]);
    }, 1000);
  };

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="chatbot-container">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="chat-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      ) : (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="message-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h2>College Assistant</h2>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="close-button"
            >
              ✕
            </button>
          </div>

          {/* Chat display */}
          <div id="chat-container" className="chat-messages">
            {chat.length === 0 ? (
              <div className="welcome-message">
                <p>Hi there! I can help answer your questions.</p>
                <p className="welcome-subtitle">Select a question below to get started.</p>
              </div>
            ) : (
              chat.map((msg, index) => (
                <div
                  key={index}
                  className={msg.type === "user" ? "message user-message" : "message bot-message"}
                >
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                  <div className="message-sender">
                    {msg.type === "user" ? (
                      <>
                        <span>You</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>Assistant</span>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="message bot-message">
                <div className="message-bubble typing">
                  <span className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Questions list */}
          <div className="questions-container">
            <h3 className="questions-title">Frequently Asked Questions:</h3>
            <div className="questions-list">
              {questions.map((qa) => (
                <button
                  key={qa.id}
                  className="question-button"
                  onClick={() => handleQuestionClick(qa.question, qa.answer)}
                >
                  {qa.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .chat-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          width: 60px;
          height: 60px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, background-color 0.2s;
        }

        .chat-button:hover {
          background-color: #2563eb;
          transform: scale(1.05);
        }

        .chat-window {
          width: 350px;
          height: 500px;
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }

        .chat-header {
          background-color: #3b82f6;
          color: white;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-title {
          display: flex;
          align-items: center;
        }

        .chat-title h2 {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
          margin-left: 8px;
        }

        .message-icon {
          margin-right: 8px;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 5px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background-color: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .welcome-message {
          text-align: center;
          margin-top: 40px;
          color: #6b7280;
        }

        .welcome-subtitle {
          font-size: 14px;
          margin-top: 5px;
          color: #9ca3af;
        }

        .message {
          display: flex;
          flex-direction: column;
          max-width: 80%;
        }

        .user-message {
          align-self: flex-end;
        }

        .bot-message {
          align-self: flex-start;
        }

        .message-bubble {
          padding: 10px 14px;
          border-radius: 18px;
          margin-bottom: 4px;
          word-break: break-word;
        }

        .user-message .message-bubble {
          background-color: #3b82f6;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bot-message .message-bubble {
          background-color: #e5e7eb;
          color: #1f2937;
          border-bottom-left-radius: 4px;
        }

        .message-sender {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
          margin-left: 4px;
          margin-right: 4px;
        }

        .user-message .message-sender {
          justify-content: flex-end;
        }

        .questions-container {
          padding: 15px;
          border-top: 1px solid #e5e7eb;
        }

        .questions-title {
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          margin-top: 0;
          margin-bottom: 10px;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 150px;
          overflow-y: auto;
        }

        .question-button {
          text-align: left;
          background-color: #f3f4f6;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: background-color 0.2s;
        }

        .question-button:hover {
          background-color: #e5e7eb;
        }

        .typing {
          padding: 10px;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
        }

        .dot {
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background-color: #9ca3af;
          margin-right: 4px;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
          margin-right: 0;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;