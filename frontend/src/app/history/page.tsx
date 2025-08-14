"use client";
import { useState, useEffect } from "react";
import Navbar from "../constants/navbar";
import Sidebar from "../constants/sidebar";

interface Conversation {
  timestamp: string;
  user_input: string;
  ai_output: string;
}

const ConvHistory = () => {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ensure we're on the client side before using localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load token from localStorage safely in the browser
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      const authtoken = localStorage.getItem("authToken");
      setToken(authtoken);
    }
  }, [isClient]);

  // Fetch history after token is available
  useEffect(() => {
    if (!token || !isClient) return;

    const fetchHistory = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, isClient]);

  const handleLoadHistory = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/chat/history`, {
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
    } finally {
      setLoading(false);
    }
  };

  // Don't render until we're on the client to avoid hydration issues
  if (!isClient) {
    return null;
  }

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
      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>

      <Navbar />
      <Sidebar />

      <div
        style={{
          position: "absolute",
          top: "90px",
          left: "60px",
          right: "0",
          bottom: "0",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "10px",
            padding: "20px",
            minHeight: "calc(100vh - 140px)",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#333",
              textAlign: "center",
            }}
          >
            Conversation History
          </h1>
          
          <button
            onClick={handleLoadHistory}
            disabled={!token || loading}
            style={{
              backgroundColor: !token || loading ? "#ccc" : "#0077b6",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: !token || loading ? "not-allowed" : "pointer",
              marginBottom: "20px",
              display: "block",
              margin: "0 auto 20px auto",
            }}
          >
            {loading ? "Loading..." : "Refresh History"}
          </button>

          <div>
            {loading ? (
              <p style={{ textAlign: "center", color: "#666" }}>Loading history...</p>
            ) : history.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {history.map((conv, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      padding: "15px",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#6c757d" }}>
                        {new Date(conv.timestamp).toLocaleString()}
                      </strong>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <span style={{ fontWeight: "bold", color: "#0077b6" }}>You:</span>{" "}
                      <span style={{ color: "#333" }}>{conv.user_input}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold", color: "#28a745" }}>Bot:</span>{" "}
                      <span style={{ color: "#333" }}>{conv.ai_output}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#666" }}>
                No conversation history available.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConvHistory;