import React, { useState } from "react";
import { FaMapMarkerAlt, FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileStaff from "./ProfileStaff";
import "./LocationDetail.css";

interface Port {
  id: number;
  port: string;
  power: string;
  status: "available" | "maintenance";
}

interface Station {
  id: number;
  name: string;
  address: string;
  top: string;
  left: string;
  ports: Port[];
}

interface GuestInfo {
  name: string;
  phone: string;
  email: string;
  carBrand: string;
}

interface ChargingInfo {
  stationName: string;
  port: string;
  power: string;
  guest: GuestInfo;
}

const LocationDetail: React.FC = () => {
  const navigate = useNavigate();

  const stations: Station[] = [
    {
      id: 1,
      name: "Trạm Q.1 - Nguyễn Huệ",
      address: "123 Nguyễn Huệ, Q.1",
      top: "40%",
      left: "48%",
      ports: [
        { id: 1, port: "M", power: "80 kW", status: "available" },
        { id: 2, port: "N", power: "110 kW", status: "maintenance" },
        { id: 3, port: "D", power: "150 kW", status: "available" },
      ],
    },
    {
      id: 2,
      name: "Trạm Phú Mỹ Hưng",
      address: "456 Nguyễn Văn Linh, Q.7",
      top: "62%",
      left: "54%",
      ports: [
        { id: 1, port: "M", power: "80 kW", status: "available" },
        { id: 2, port: "N", power: "110 kW", status: "available" },
      ],
    },
  ];

  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "",
    phone: "",
    email: "",
    carBrand: "",
  });
  const [currentCharging, setCurrentCharging] = useState<ChargingInfo[]>([]);

  const handleSelectStation = (stationId: number) => {
    setSelectedStation(stationId);
    setSelectedPort(null);
    setGuestInfo({ name: "", phone: "", email: "", carBrand: "" });
  };

  const handleSelectPort = (portId: number) => setSelectedPort(portId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handleStartCharging = () => {
    if (!selectedStation || !selectedPort) return alert("Vui lòng chọn trạm và cổng!");
    const station = stations.find((s) => s.id === selectedStation)!;
    const port = station.ports.find((p) => p.id === selectedPort)!;
    setCurrentCharging((prev) => [
      ...prev,
      { stationName: station.name, port: port.port, power: port.power, guest: guestInfo },
    ]);
    alert(`Bắt đầu sạc tại ${station.name} - cổng ${port.port} cho khách ${guestInfo.name}`);
    setSelectedStation(null);
    setSelectedPort(null);
  };

  return (
    <div className="staff-wrapper">
      {/* SIDEBAR */}
      <aside className="staff-sidebar">
        <div>
          <div className="staff-logo">⚡ EV Staff</div>
          <nav className="staff-menu">
            <ul>
              <li onClick={() => navigate("/staff")}>About</li>
              <li className="active" onClick={() => navigate("/staff/location")}>Location</li>
              <li onClick={() => navigate("/staff/sessions")}>Sessions</li>
              <li onClick={() => navigate("/staff/report")}>Report</li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <div className="staff-main-wrapper">
        <header className="staff-header">
          <h1>📍 Quản Lý Trạm Sạc</h1>
          <div className="staff-header-actions">
            <ProfileStaff />
          </div>
        </header>

        <main className="staff-main">
          <div className="map-section">
            <div className="map-view" style={{ backgroundImage: `url("/ggmap.jpg")` }}>
              {stations.map((station) => (
                <FaMapMarkerAlt
                  key={station.id}
                  className={`map-marker ${selectedStation === station.id ? "selected" : ""}`}
                  style={{ top: station.top, left: station.left }}
                  onClick={() => handleSelectStation(station.id)}
                />
              ))}
            </div>
          </div>

          {selectedStation && (
            <div className="station-detail">
              <h2>Chi Tiết Trạm</h2>
              <p>
                <strong>Tên:</strong> {stations.find((s) => s.id === selectedStation)?.name}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {stations.find((s) => s.id === selectedStation)?.address}
              </p>

              <div className="ports">
                <h3>Chọn Cổng Sạc</h3>
                {stations
                  .find((s) => s.id === selectedStation)!
                  .ports.map((port) => (
                    <button
                      key={port.id}
                      className={selectedPort === port.id ? "port-selected" : ""}
                      disabled={port.status === "maintenance"}
                      onClick={() => handleSelectPort(port.id)}
                    >
                      {port.port} - {port.power} {port.status === "maintenance" ? "(Bảo trì)" : ""}
                    </button>
                  ))}
              </div>

              <div className="guest-info">
                <h3>Thông Tin Khách</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  value={guestInfo.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={guestInfo.phone}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={guestInfo.email}
                  onChange={handleInputChange}
                />
                <select name="carBrand" value={guestInfo.carBrand} onChange={handleInputChange}>
                  <option value="">Chọn hãng xe</option>
                  <option>VinFast</option>
                  <option>Tesla</option>
                  <option>Hyundai</option>
                </select>
              </div>

              <button className="start-btn" onClick={handleStartCharging}>
                🚀 Bắt Đầu Sạc
              </button>
            </div>
          )}

          <div className="current-charging">
            <h2>Đang Sạc</h2>
            {currentCharging.length === 0 && <p>Chưa có khách nào đang sạc</p>}
            {currentCharging.map((c, idx) => (
              <div key={idx} className="charging-card">
                <p>
                  <strong>Trạm:</strong> {c.stationName}
                </p>
                <p>
                  <strong>Cổng:</strong> {c.port} - {c.power}
                </p>
                <p>
                  <strong>Khách:</strong> {c.guest.name} ({c.guest.phone})
                </p>
              </div>
            ))}
          </div>
        </main>

        <footer className="staff-footer">@SWP Fall 2025</footer>
      </div>
    </div>
  );
};

export default LocationDetail;
