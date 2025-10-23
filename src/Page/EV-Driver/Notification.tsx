import React, { useState } from "react";
import { FaBell } from "react-icons/fa";

const Notification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-container" style={{ position: "relative" }}>
      {/* Nút chuông */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "white",
        }}
      >
        <FaBell size={22} />
      </button>

      {/* Dropdown thông báo */}
      {isOpen && (
        <div
          className="notification-dropdown"
          style={{
            position: "absolute",
            right: 0,
            marginTop: "10px",
            width: "250px",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            color: "white",
            borderRadius: "12px",
            padding: "12px",
            zIndex: 99,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              paddingBottom: "6px",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            🔔 Thông báo
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{
                padding: "6px 8px",
                borderRadius: "6px",
                transition: "background 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Bạn chưa có thông báo mới.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
