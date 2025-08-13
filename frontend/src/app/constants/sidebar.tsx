"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const router = useRouter();

  const handleChatClick = () => {
    router.push('/llm')
  }

    const handleHistoryClick = () => {
        router.push('/history')
    }

  return (
    <div
      style={{
        position: "fixed", 
        top: "80px",
        left: 0,
        height: "calc(100% - 90px)", 
        width: isExpanded ? "200px" : "60px",
        borderRight: "1px solid #ade8f4",
        transition: "width 0.3s ease",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)", 
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          color: "#0077b6",
          fontWeight: "bold",
        }}
      >
        {isExpanded ? "←" : "→"}
      </button>

      <ul
        style={{
          listStyleType: "none",
          padding: "10px",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <li style={{ cursor: "pointer", color: "#0077b6" }} onClick={handleChatClick}>
          {isExpanded ? "Chat" : "C"}
        </li>
        <li style={{ cursor: "pointer", color: "#0077b6" }} onClick={handleHistoryClick}>
          {isExpanded ? "History" : "H"}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
