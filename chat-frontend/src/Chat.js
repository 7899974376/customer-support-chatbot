// 
import React, { useState, useEffect, useRef } from "react";
// import API from "./api";
import axios from "axios";

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

    const userMessage = { sender: "user", text: input };
    setConversation(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/chat", {
        message: input,
      });

      const aiResponse = {
        sender: "ai",
        text: res.data.response || "No response received from AI.",
      };

      setConversation(prev => [...prev, aiResponse]);
    } catch (err) {
      setConversation(prev => [
        ...prev,
        { sender: "ai", text: `❌ Error: ${err.message}` },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>💬 Chat with Groq AI</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          height: "400px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "15px",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e0e0e0",
                color: msg.sender === "user" ? "white" : "black",
              }}
            >
              <b>{msg.sender === "user" ? "You" : "Groq"}:</b> {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: "1rem", display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}


// export default function Chat() {
//   const [input, setInput] = useState("");
//   const [conversation, setConversation] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [conversation]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setConversation(prev => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await API.post("/chat", {
//         message: input,
//         conversation_id: "abc123", // Can be dynamic if needed
//       });

//       const aiResponse = {
//         sender: "ai",
//         text: res?.data?.response || "No response received from AI.",
//       };

//       setConversation(prev => [...prev, aiResponse]);
//     } catch (err) {
//       setConversation(prev => [
//         ...prev,
//         { sender: "ai", text: `❌ Error: ${err.message}` },
//       ]);
//     }

//     setLoading(false);
//   };

//   const handleKeyDown = e => {
//     if (e.key === "Enter") sendMessage();
//   };

//   return (
//     <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>💬 Chat with AI</h2>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: "10px",
//           padding: "1rem",
//           height: "400px",
//           overflowY: "auto",
//           backgroundColor: "#f9f9f9",
//         }}
//       >
//         {conversation.map((msg, index) => (
//           <div
//             key={index}
//             style={{
//               marginBottom: "1rem",
//               textAlign: msg.sender === "user" ? "right" : "left",
//             }}
//           >
//             <div
//               style={{
//                 display: "inline-block",
//                 padding: "0.5rem 1rem",
//                 borderRadius: "15px",
//                 backgroundColor: msg.sender === "user" ? "#007bff" : "#e0e0e0",
//                 color: msg.sender === "user" ? "white" : "black",
//               }}
//             >
//               <b>{msg.sender === "user" ? "You" : "AI"}:</b> {msg.text}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div style={{ marginTop: "1rem", display: "flex" }}>
//         <input
//           type="text"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message..."
//           style={{
//             flexGrow: 1,
//             padding: "0.5rem 1rem",
//             fontSize: "1rem",
//             borderRadius: "20px",
//             border: "1px solid #ccc",
//             outline: "none",
//           }}
//         />
//         <button
//           onClick={sendMessage}
//           disabled={loading}
//           style={{
//             marginLeft: "1rem",
//             padding: "0.5rem 1rem",
//             borderRadius: "20px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             cursor: loading ? "not-allowed" : "pointer",
//           }}
//         >
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }

