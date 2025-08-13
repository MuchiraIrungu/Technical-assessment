"use client";
import { useState, useEffect } from "react";
import Navbar from "../constants/navbar";
import Sidebar from "../constants/sidebar";

interface Conversation {
  timestamp: string;
  user_input: string;
  ai_output: string;
}

const fetchHistory = async (
  setHistory: React.Dispatch<React.SetStateAction<Conversation[]>>
) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("http://localhost:8001/chat/history", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    setHistory(data.conversations ?? []);
  } catch (error) {
    console.error("Error fetching history:", error);
  }
};

const ConvHistory = () => {
  const [history, setHistory] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchHistory(setHistory);
  }, []);

  return (
    <main
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1639152201720-5e536d254d81?w=800&auto=format&fit=crop&q=60')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>

      <Navbar />
      <Sidebar />

      <h1 className="text-white text-2xl font-bold p-4">
        Conversation History
      </h1>
      <button
        onClick={() => fetchHistory(setHistory)}
        className="bg-blue-700 text-white p-2 rounded"
      >
        Load History
      </button>
      <div className="p-4">
        {history.length > 0 ? (
          <ul>
            {history.map((conv, index) => (
              <li key={index} className="text-white mb-4">
              <div>
                <strong>{new Date(conv.timestamp).toLocaleString()}</strong>
              </div>
              <div>
                <span className="font-bold text-blue-400">You:</span> {conv.user_input}
              </div>
              <div>
                <span className="font-bold text-green-400">Bot:</span> {conv.ai_output}
              </div>
            </li>
              
            ))}
          </ul>
        ) : (
          <p className="text-white">No history available.</p>
        )}
      </div>
    </main>
  );
};

export default ConvHistory;
