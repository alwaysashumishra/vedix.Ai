import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiCompass, FiZap, FiUser, FiCpu } from "react-icons/fi";

const TravelChat = ({ onSendMessage, messages = [], isLoading = false }) => {
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef(null);

  const samplePrompts = [
    "I want to go from Ghaziabad to Jaipur on September 20 for 3 people. My total budget is ₹20,000. I prefer AC bus and want a good hotel near main attractions.",
    "Plan a 4-day peaceful mountain getaway for 2 people from Delhi with a ₹30,000 budget.",
    "Looking for Vande Bharat train to Jaipur for 4 travelers, budget ₹25,000 with heritage hotel.",
    "Weekend trip to Jaipur under ₹15,000 for 2 adults, prefer cheap transport and best value stay.",
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handlePromptChipClick = (prompt) => {
    setInputText(prompt);
  };

  return (
    <div className="travel-chat-card">
      <div className="chat-header">
        <div className="chat-title-info">
          <FiCompass className="chat-icon" />
          <div>
            <h4>AI Travel Assistant Chat</h4>
            <p>Describe your trip naturally in plain English or Hindi. I'll extract parameters and orchestrate the search.</p>
          </div>
        </div>
      </div>

      <div className="chat-body-messages">
        {messages.length === 0 ? (
          <div className="empty-chat-welcome">
            <div className="welcome-avatar">✈️</div>
            <h3>Hello! Where would you like to travel?</h3>
            <p>You don't need to fill out a long form. Just tell me your destination, dates, budget, or preferences.</p>

            <div className="prompt-chips-title">
              <FiZap /> Click a sample query to try:
            </div>
            <div className="sample-chips-grid">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="chip-prompt-btn"
                  onClick={() => handlePromptChipClick(prompt)}
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`chat-message-row ${msg.sender === "user" ? "user-row" : "agent-row"}`}>
              <div className="message-avatar">
                {msg.sender === "user" ? <FiUser /> : <FiCpu />}
              </div>
              <div className="message-content-bubble">
                <div className="sender-label">{msg.sender === "user" ? "You" : "Travel Manager Agent"}</div>
                <div className="message-text">{msg.text}</div>
                {msg.extractedSummary && (
                  <div className="extracted-params-badge">
                    ⚡ <strong>Extracted Parameters:</strong> {msg.extractedSummary}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="chat-message-row agent-row loading-row">
            <div className="message-avatar"><FiCpu /></div>
            <div className="message-content-bubble">
              <div className="thinking-dots">
                <span></span><span></span><span></span>
              </div>
              <p className="thinking-text">Travel Orchestrator Agent is searching buses, flights, trains & stays...</p>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="e.g. 'I want to go to Jaipur from Ghaziabad for 3 people, budget ₹20,000'"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputText.trim() || isLoading}>
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default TravelChat;
