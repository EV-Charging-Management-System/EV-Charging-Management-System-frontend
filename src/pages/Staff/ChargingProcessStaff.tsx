// src/pages/staff/ChargingProcessStaff.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSidebar from "../../pages/layouts/staffSidebar";
import "../../css/ChargingProcessStaff.css";
import { FaMapMarkerAlt, FaBolt, FaCalendarAlt, FaClock, FaHashtag } from "react-icons/fa";

interface Session {
  SessionId: number;
  LicensePlate?: string;
  companyName?: string;
  Battery?: number;
  portId?: number;
  portType?: string;
  ChargingStatus?: string;
  StationName?: string;
  chargerName?: string;
  power?: string;
  status?: "waiting" | "charging" | "done";
  address?: string;
  date?: string;
  time?: string;
}

const ChargingProcessStaff: React.FC = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [battery, setBattery] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // 🧩 Hardcode danh sách phiên chờ
  useEffect(() => {
    const hardcodedSessions: Session[] = [
      {
        SessionId: 1,
        LicensePlate: "51H-12345",
        companyName: "Công ty A",
        Battery: 20,
        StationName: "Trạm Sạc Trung Tâm Quận 1",
        chargerName: "Cổng M",
        power: "80kW",
        status: "waiting",
        address: "123 Nguyễn Huệ, Quận 1",
        date: "20/01/2025",
        time: "14:00",
      },
    ];
    setSessions(hardcodedSessions);
  }, []);

  // 🪫 Khi đang sạc → tăng pin, thời gian, chi phí
  useEffect(() => {
    let interval: number | undefined;
    if (activeSession?.status === "charging" && battery < 100) {
      interval = window.setInterval(() => {
        setBattery((prev) => Math.min(prev + 1, 100));
        setTime((t) => t + 1);
        setCost((c) => c + 5000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession, battery]);

  // ⚡ Bắt đầu sạc
  const handleStartSession = (session: Session) => {
    setActiveSession({ ...session, status: "charging" });
    setBattery(session.Battery || 0);
    setStartTime(new Date());
    setTime(0);
    setCost(0);
  };

  // ❌ Hủy phiên chờ
const handleCancelSession = (sessionId: number) => {
  setSessions((prev) => prev.filter((s) => s.SessionId !== sessionId));
};

// ⏹️ Dừng sạc
// ⏹️ Dừng sạc
const handleStop = () => {
  if (!activeSession) return;
  const now = new Date();
  const ended: Session = { ...activeSession, status: "done", Battery: battery };
  setActiveSession(ended);
  setEndTime(now);
  setSessions((prev) =>
    prev.map((s) => (s.SessionId === ended.SessionId ? ended : s))
  );
};




  // 💳 Thanh toán
  const handlePayment = () => {
    if (!activeSession) return;
    localStorage.setItem(
      "currentInvoice",
      JSON.stringify({
        ...activeSession,
        battery,
        startTime,
        endTime,
        cost,
      })
    );
    navigate(`/staff/invoice/`);
  };

  const formatDateTime = (date: Date | null) =>
    date
      ? `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()} ${date
          .getHours()
          .toString()
          .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
      : "--/--/---- --:--";

  return (
    <div className="charging-wrapper">
      <StaffSidebar />
      <div className="charging-main-wrapper fade-in">
        <header className="charging-header">
          <h1>Optimising your journey, Powering your life</h1>
          <ProfileStaff />
        </header>

        <main className="charging-body">
          <h2 className="charging-title" style={{ marginBottom: "20px" }}>
            {activeSession ? "Phiên Sạc Đang Diễn Ra" : "Lịch Sắp Tới"}
          </h2>

          {activeSession ? (
            // 🔋 Giao diện sạc hiện tại (giữ nguyên)
            <div className="charging-card">
              <div className="charge-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${battery}%` }}
                  />
                </div>
                <span className="battery-level">{battery}% pin</span>
                {activeSession.status === "charging" && (
                  <div className="charging-buttons">
                    <button onClick={handleStop}>⏹️ Dừng sạc</button>
                  </div>
                )}
              </div>

              <div className="session-info">
                <div className="info-box">
                  <h3>Xe & Trạm</h3>
                  <p>Biển số: <strong>{activeSession.LicensePlate}</strong></p>
                  <p>Công ty: <strong>{activeSession.companyName}</strong></p>
                  <p>Trạm: <strong>{activeSession.StationName}</strong></p>
                  <p>Cổng: <strong>{activeSession.chargerName}</strong></p>
                  <p>Công suất: <strong>{activeSession.power}</strong></p>
                </div>

                <div className="info-box">
                  <h3>Thời gian & Chi phí</h3>
                  <p>Thời gian: <strong>{time} phút</strong></p>
                  <p>Chi phí: <strong>{cost.toLocaleString()}đ</strong></p>
                  <p>Bắt đầu: <strong>{formatDateTime(startTime)}</strong></p>
                  <p>Kết thúc: <strong>{formatDateTime(endTime)}</strong></p>
                </div>
              </div>

              {activeSession.status === "done" && (
                <div className="payment-card">
                  <h3>Thanh Toán</h3>
                  <p>Biển số: <strong>{activeSession.LicensePlate}</strong></p>
                  <p className="total-cost">
                    Tổng: {cost.toLocaleString()}đ
                  </p>
                  <button onClick={handlePayment}>💳 Thanh toán</button>
                </div>
              )}
            </div>
          ) : (
            // 🕓 UI danh sách chờ phiên sạc — kiểu “Lịch Sắp Tới”
            <div className="waiting-list">
              {sessions.map((s) => (
                <div
                  key={s.SessionId}
                  className="waiting-card"
                  style={{
                    width: "90%",
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700 }}>
                      {s.StationName}
                    </h3>
                    <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FaMapMarkerAlt /> {s.address}
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FaBolt /> Cổng sạc {s.chargerName} - {s.power}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FaCalendarAlt /> Ngày: <strong>{s.date}</strong>
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FaClock /> Giờ: <strong>{s.time}</strong>
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FaHashtag /> Mã sạc: <strong>#ABC{s.SessionId}</strong>
                    </p>
                    <p style={{ color: "#16a34a", fontWeight: 600, marginTop: 4 }}>
                      Đã xác nhận
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginLeft: "20px",
                    }}
                  >
                    <button
                      onClick={() => handleStartSession(s)}
                      style={{
                        background:
                          "linear-gradient(90deg, #ff8c00, #ff6600)",
                        color: "#fff",
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                      }}
                    >
                      Bắt đầu sạc
                    </button>
                    <button
                      onClick={() => handleCancelSession(s.SessionId)}
                      style={{
                        background: "#f43f5e",
                        color: "#fff",
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Hủy lịch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChargingProcessStaff;
