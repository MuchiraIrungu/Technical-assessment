"use client";
import { useState } from "react";
import Navbar from "../constants/navbar";
import Sidebar from "../constants/sidebar";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    
    setInput(""); // clear input box
    const token = localStorage.getItem("authToken");
    console.log("Token sent in request:", token);

    try {
      const response = await fetch("http://localhost:8001/chat/input", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();

      
      setMessages((prev) => [...prev, { sender: "ai", text: data.output }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error getting response" },
      ]);
    }
  };

  return (
    <main
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1639152201720-5e536d254d81?w=800&auto=format&fit=crop&q=60')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <Navbar />
      <Sidebar />

      {/* Chat container */}
      <div
        style={{
          position: "absolute",
          top: "90px", // below navbar
          left: "60px", // next to sidebar
          right: "0",
          bottom: "0",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        {/* Message list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.sender === "user" ? "#4cafef" : "#e4c1f9",
                color: msg.sender === "user" ? "#fff" : "#333",
                padding: "10px 15px",
                borderRadius: "15px",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            padding: "10px",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "10px",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              backgroundColor: "#0077b6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
