import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileStaff from "./ProfileStaff";
import "./Location.css";

interface Station {
  id: number;
  name: string;
  address: string;
  empty: number;
  total: number;
  status: "active" | "busy" | "offline";
  top: string;
  left: string;
}

const Location: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [hoverStation, setHoverStation] = useState<number | null>(null);

  const stations: Station[] = [
    { id: 1, name: "Trạm Q.1 - Nguyễn Huệ", address: "123 Nguyễn Huệ, Q.1", empty: 3, total: 6, status: "active", top: "40%", left: "48%" },
    { id: 2, name: "Trạm Phú Mỹ Hưng", address: "456 Nguyễn Văn Linh, Q.7", empty: 5, total: 6, status: "active", top: "62%", left: "54%" },
    { id: 3, name: "Trạm Thủ Đức", address: "789 Võ Văn Ngân, Thủ Đức", empty: 2, total: 6, status: "active", top: "38%", left: "70%" },
    { id: 4, name: "Trạm Tân Bình", address: "12 Tây Thạnh, Tân Phú", empty: 0, total: 6, status: "offline", top: "45%", left: "28%" },
    { id: 5, name: "Trạm Gò Vấp", address: "88 Phan Văn Trị, Gò Vấp", empty: 4, total: 6, status: "active", top: "30%", left: "52%" },
  ];

  const getColor = (status: string) => {
    switch (status) {
      case "active": return "#00d66b";
      case "busy": return "#ff7a00";
      case "offline": return "#ff4747";
      default: return "#aaa";
    }
  };

  const isHighlighted = (id: number) => selectedStation === id || hoverStation === id;

  return (
    <div className="staff-wrapper">
      {/* SIDEBAR */}
      <aside
        className={`staff-sidebar ${sidebarVisible ? "visible" : ""}`}
        onMouseEnter={() => setSidebarVisible(true)}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <div>
          <div className="staff-logo">⚡ EV Staff</div>
          <nav className="staff-menu">
            <ul>
              <li onClick={() => navigate("/staff")}>About</li>
              <li className="active" onClick={() => navigate("/staff/location")}>Location</li>
              <li onClick={() => navigate("/staff/sessions")}>Sessions</li>
              <li onClick={() => navigate("/staff/invoice")}>Invoice</li>
              <li onClick={() => navigate("/staff/report")}>Report To Admin</li>
              <li onClick={() => navigate("/staff/settings")}>Settings</li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={() => navigate("/")}>← Exit</button>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="staff-main-wrapper">
        <header className="staff-header">
          <h1>📍 Quản Lý Trạm Sạc</h1>
          <div className="staff-header-actions">
            <ProfileStaff />
          </div>
        </header>

        <main className="staff-main">
          <div className="location-center">
            <div className="location-box">
              {/* MAP */}
              <div className="map-section">
                <div className="map-view" style={{ backgroundImage: `url("/ggmap.jpg")` }}>
                  {stations.map(station => {
                    const highlighted = isHighlighted(station.id);
                    return (
                      <FaMapMarkerAlt
                        key={station.id}
                        className={`map-marker ${highlighted ? "marker-highlight" : ""}`}
                        style={{
                          top: station.top,
                          left: station.left,
                          color: highlighted ? "#ffcc00" : getColor(station.status),
                          fontSize: highlighted ? 22 : 18,
                          zIndex: highlighted ? 30 : 20,
                        }}
                        onMouseEnter={() => setHoverStation(station.id)}
                        onMouseLeave={() => setHoverStation(null)}
                        onClick={() => setSelectedStation(prev => prev === station.id ? null : station.id)}
                      />
                    );
                  })}

                  {/* Thông tin trạm popup khi click */}
                  {selectedStation !== null && stations
                    .filter(s => s.id === selectedStation)
                    .map(s => (
                      <div
                        key={s.id}
                        className="station-popup"
                        style={{
                          position: "absolute",
                          top: `calc(${s.top} - 110px)`,
                          left: `calc(${s.left} - 150px)`,
                          width: "300px",
                          background: "rgba(12,18,30,0.9)",
                          padding: "12px",
                          borderRadius: "8px",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
                          zIndex: 50,
                        }}
                      >
                        <div className="station-info">
                          <h3>{s.name}</h3>
                          <p>{s.address}</p>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${(s.empty / s.total) * 100}%`, backgroundColor: getColor(s.status) }}
                            />
                          </div>
                          <div className="station-status">
                            <span>{s.empty}/{s.total} trống</span>
                            <span style={{ color: getColor(s.status) }}>{s.status.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="station-actions">
                          <button className="btn-report">Xem Chi Tiết</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="staff-footer">@SWP Fall 2025</footer>
      </div>
    </div>
  );
};

export default Location;
