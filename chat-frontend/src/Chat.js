import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/chat"; // Change if your backend is on another route/port

export default function Chat() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setConversation((c) => [...c, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(API_URL, {
        message: input,
        conversation_id: null // Send session id here if you want session awareness
      });
      const aiMsg = { role: "ai", content: res.data.response };
      setConversation((c) => [...c, aiMsg]);
    } catch (err) {
      setConversation((c) => [...c, { role: "ai", content: "Error contacting AI!" }]);
    }
    setInput("");
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", border: "1px solid #ccc", borderRadius: 6, padding: 16 }}>
      <div style={{ height: "400px", overflowY: "auto", marginBottom: 16, background: "#fafafa", padding: 8 }}>
        {conversation.map((msg, idx) =>
          <div key={idx} style={{ margin: "10px 0", textAlign: msg.role === "user" ? "right" : "left" }}>
            <span style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: 20,
              background: msg.role === "user" ? "#007bff" : "#e5e5ea",
              color: msg.role === "user" ? "#fff" : "#111"
            }}>
              {msg.content}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message…"
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ marginLeft: 8, padding: "0 24px", fontSize: 16 }}>
          Send
        </button>
      </div>
    </div>
  );
}
