import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import ProfileStaff from "./ProfileStaff";
import ChargingProcessStaff from "./ChargingProcessStaff";
import "./Sessions.css";

interface Session {
  id: number;
  stationName: string;
  chargerName: string;
  power: string;
  customer: string;
  phone: string;
  carBrand: string;
  status: "pending" | "charging" | "completed";
}

const Sessions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem("offlineSessions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("offlineSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ===============================
  // XỬ LÝ NÚT HÀNH ĐỘNG
  // ===============================
  const handleStart = (id: number) => {
    // Cập nhật trạng thái sang "charging"
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "charging" } : s))
    );

    // Chuyển sang trang con (chi tiết sạc)
    navigate(`/staff/sessions/${id}`);
  };

  const handleCancel = (id: number) => {
    const confirmed = window.confirm("Hủy phiên sạc này?");
    if (confirmed) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleComplete = (id: number) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "completed" } : s))
    );
  };

  // ===============================
  // GIAO DIỆN CHÍNH
  // ===============================
  return (
    <div className="sessions-wrapper">
      <aside className="sessions-sidebar-hover">
        <div className="sessions-sidebar">
          <div className="sessions-logo">⚡ EV STAFF</div>
          <nav className="sessions-menu">
            <ul>
              <li onClick={() => navigate("/staff")}>About</li>
              <li onClick={() => navigate("/staff/location")}>Location</li>
              <li onClick={() => navigate("/staff/locationdetail/1")}>Location Detail</li>
              <li className="active">Sessions</li>
              <li onClick={() => navigate("/staff/invoice")}>Invoice</li>
              <li onClick={() => navigate("/staff/report")}>Report To Admin</li>
              <li onClick={() => navigate("/staff/settings")}>Settings</li>
            </ul>
          </nav>
          <button className="logout-btn" onClick={() => navigate("/")}>
            ← Exit
          </button>
        </div>
      </aside>

      <div
        className={`sessions-main-wrapper ${showContent ? "fade-in" : "hidden"}`}
      >
        <main className="sessions-main">
          <header className="sessions-header">
            <h1>Offline Charging Sessions</h1>
            <div className="sessions-header-actions">
              <ProfileStaff />
            </div>
          </header>

          {/* ===============================
              NESTED ROUTE: danh sách hoặc trang con
          =============================== */}
          <Routes>
            <Route
              index
              element={
                <section className="sessions-body">
                  {sessions.length === 0 ? (
                    <p className="no-sessions">Hiện chưa có phiên sạc offline nào.</p>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`session-card ${session.status}`}
                      >
                        <div className="session-left">
                          <h3>{session.stationName}</h3>
                          <p>{session.chargerName}</p>
                        </div>

                        <div className="session-center">
                          <p><strong>Khách:</strong> {session.customer}</p>
                          <p><strong>Xe:</strong> {session.carBrand} – {session.power}</p>
                          <p><strong>SĐT:</strong> {session.phone}</p>
                        </div>

                        <div className="session-right">
                          {session.status === "pending" && (
                            <>
                              <button
                                className="start-btn"
                                onClick={() => handleStart(session.id)}
                              >
                                Bắt đầu sạc
                              </button>
                              <button
                                className="cancel-btn"
                                onClick={() => handleCancel(session.id)}
                              >
                                Hủy
                              </button>
                            </>
                          )}

                          {session.status === "charging" && (
                            <>
                              <span className="charging-status">Đang sạc...</span>
                              <button
                                className="complete-btn"
                                onClick={() => handleComplete(session.id)}
                              >
                                Hoàn tất
                              </button>
                            </>
                          )}

                          {session.status === "completed" && (
                            <span className="completed-status">Hoàn thành ✅</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </section>
              }
            />
            <Route path=":id" element={<ChargingProcessStaff />} />
          </Routes>
        </main>

        <footer className="footer">@SWP Staff Fall 2025</footer>
      </div>
    </div>
  );
};

export default Sessions;
