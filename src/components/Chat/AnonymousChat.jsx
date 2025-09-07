// src/components/Chat/AnonymousChat.jsx
import React, { useState, useEffect, useRef } from "react";
import { FiX, FiMessageCircle, FiThumbsUp, FiThumbsDown, FiTrash2 } from "react-icons/fi";
import "./anonymousChat.scss";

const AnonymousChat = ({ isOpen, toggleChat }) => {
  const currentUser = "guest_" + Math.floor(Math.random() * 9999); // 👤 simulate user session

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "System",
      text: "Welcome to Public Chat 🎉 Be respectful and have fun!",
      pinned: true,
      upvotes: 0,
      downvotes: 0,
      votesByUser: {}, // 🔑 track votes { userId: "up" | "down" }
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Typing detection
  useEffect(() => {
    if (input.length > 0) {
      setTyping(true);
      const timeout = setTimeout(() => setTyping(false), 1500);
      return () => clearTimeout(timeout);
    } else {
      setTyping(false);
    }
  }, [input]);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: `Guest${Math.floor(Math.random() * 9999)}`,
      text: input,
      pinned: false,
      upvotes: 0,
      downvotes: 0,
      votesByUser: {},
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  // Voting logic (1 vote per user per message)
  const handleVote = (msgId, type) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;

        const prevVote = msg.votesByUser[currentUser];

        let upvotes = msg.upvotes;
        let downvotes = msg.downvotes;

        // If user is changing their vote
        if (prevVote && prevVote !== type) {
          if (prevVote === "up") upvotes -= 1;
          if (prevVote === "down") downvotes -= 1;
        }

        // If user hasn’t voted yet OR is changing vote
        if (!prevVote || prevVote !== type) {
          if (type === "up") upvotes += 1;
          if (type === "down") downvotes += 1;
        }

        return {
          ...msg,
          upvotes,
          downvotes,
          votesByUser: {
            ...msg.votesByUser,
            [currentUser]: type,
          },
        };
      })
    );
  };

  // Delete message
  const handleDelete = (msgId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={`chat-fab ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      <div className={`anonymous-chat ${isOpen ? "open" : ""}`}>
        <div className="chat-header">Public Anonymous Chat</div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.pinned ? "pinned" : ""}`}>
              <div className="message-top">
                <span className="user">{msg.user}:</span>
                <span className="text">{msg.text}</span>
              </div>

              <div className="message-bottom">
                <span className="time">{msg.timestamp}</span>

                <div className="actions">
                  <button onClick={() => handleVote(msg.id, "up")}>
                    <FiThumbsUp />
                    {msg.upvotes > 0 && <span>{msg.upvotes}</span>}
                  </button>
                  <button onClick={() => handleVote(msg.id, "down")}>
                    <FiThumbsDown />
                    {msg.downvotes > 0 && <span>{msg.downvotes}</span>}
                  </button>
                  {!msg.pinned && (
                    <button onClick={() => handleDelete(msg.id)}>
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {typing && <div className="typing-indicator">Someone is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default AnonymousChat;
