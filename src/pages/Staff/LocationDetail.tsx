// src/pages/location/LocationDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSideBar from "../../pages/layouts/staffSidebar";
import locationService from "../../services/locationService";
import type { Station } from "../../services/locationService";
import chargingPointService from "../../services/chargingpointService";
import type { ChargingPoint, ChargingPort } from "../../services/chargingpointService";
import { vehicleService } from "../../services/vehicleService";
import "../../css/LocationDetail.css";

const API_BASE_URL = "http://localhost:5000/api/charging-session";

const LocationDetail: React.FC = () => {
  const { address } = useParams();
  const decodedAddress = decodeURIComponent(address || "");

  const [fadeIn, setFadeIn] = useState(false);
  const [station, setStation] = useState<Station | null>(null);
  const [chargers, setChargers] = useState<ChargingPoint[]>([]);
  const [ports, setPorts] = useState<ChargingPort[]>([]);
  const [selectedCharger, setSelectedCharger] = useState<ChargingPoint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState<"EV-Driver" | "Guest">("EV-Driver");

  const [form, setForm] = useState({
    licensePlate: "",
    displayName: "",
    battery: "",
    portId: "",
    portType: "",
    kwh: "",
    price: "",
  });

  const [loadingStation, setLoadingStation] = useState(false);
  const [loadingChargers, setLoadingChargers] = useState(false);
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Animation tải
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Lấy trạm
  useEffect(() => {
    if (!decodedAddress) return;
    setLoadingStation(true);
    (async () => {
      try {
        const res = await locationService.getStationInfo(decodedAddress);
        setStation(res);
      } catch {
        alert("⚠️ Lỗi khi lấy thông tin trạm");
      } finally {
        setLoadingStation(false);
      }
    })();
  }, [decodedAddress]);

  // Lấy trụ
  useEffect(() => {
    if (!station?.StationId) return;
    setLoadingChargers(true);
    (async () => {
      try {
        const list = await chargingPointService.getByStationId(station.StationId);
        setChargers(list);
      } catch {
        alert("⚠️ Lỗi khi lấy danh sách điểm sạc");
      } finally {
        setLoadingChargers(false);
      }
    })();
  }, [station]);

  // Mở form
  const openForm = async (charger: ChargingPoint) => {
    if (charger.ChargingPointStatus?.toLowerCase() !== "available") {
      return alert("⚠️ Điểm đang bận!");
    }
    setSelectedCharger(charger);
    setShowForm(true);
    setUserType("EV-Driver"); // mặc định

    setLoadingPorts(true);
    try {
      const portsList = await chargingPointService.getPortsByPoint(charger.PointId);
      setPorts(portsList);
    } catch {
      alert("⚠️ Lỗi lấy cổng sạc");
      setPorts([]);
    } finally {
      setLoadingPorts(false);
    }

    setForm({
      licensePlate: "",
      displayName: "",
      battery: "",
      portId: "",
      portType: "",
      kwh: "",
      price: "",
    });
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      licensePlate: e.target.value,
      displayName: "",
      battery: "",
    }));
  };

  // Tra biển số
  const handleLookupCompany = async () => {
    const plate = form.licensePlate.trim();
    if (!plate) return alert("⚠️ Nhập biển số xe!");

    try {
      const v = await vehicleService.getVehicleByLicensePlate(plate);
      if (!v) {
        setForm(prev => ({ ...prev, displayName: "", battery: "" }));
        return alert("⚠️ Xe chưa đăng ký — nhập pin thủ công!");
      }

      const display = v.companyName
        ? `Công ty: ${v.companyName} - Pin: ${v.battery}`
        : `Khách: ${v.userName} - Pin: ${v.battery}`;

      setForm(prev => ({
        ...prev,
        displayName: display,
        battery: v.battery != null ? String(v.battery) : "",
      }));
    } catch {
      alert("⚠️ Lỗi tra cứu xe");
    }
  };

  // EV Driver API
  const createChargingSession = async (
    licensePlate: string,
    stationId: number,
    pointId: number,
    portId: number,
    battery: number
  ) => {
    setLoadingSubmit(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("⚠️ Phiên đăng nhập đã hết hạn — vui lòng đăng nhập lại");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_BASE_URL}/staff/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          licensePlate,
          stationId,
          pointId,
          portId,
          batteryPercentage: battery,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Server error");

      return data;
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Guest API
  const createChargingSessionGuest = async (
    stationId: number,
    pointId: number,
    portId: number,
    battery: number
  ) => {
    setLoadingSubmit(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("⚠️ Phiên đăng nhập đã hết hạn — vui lòng đăng nhập lại");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_BASE_URL}/guest/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          stationId,
          pointId,
          portId,
          battery,
          batteryPercentage: battery,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Server error");

      return data;
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharger || !form.portId || !form.battery) {
      return alert("⚠️ Điền đủ thông tin");
    }

    try {
      let sessionData;

      if (userType === "EV-Driver") {
        if (!form.licensePlate) return alert("⚠️ Nhập biển số xe");
        sessionData = await createChargingSession(
          form.licensePlate,
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          Number(form.battery)
        );
      } else {
        // Guest
        sessionData = await createChargingSessionGuest(
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          Number(form.battery)
        );
      }

      setChargers(prev =>
        prev.map(c =>
          c.PointId === selectedCharger.PointId ? { ...c, ChargingPointStatus: "BUSY" } : c
        )
      );

      const sessionId = sessionData?.data?.sessionId ?? sessionData?.sessionId ?? "unknown";
      alert(`✅ Tạo phiên sạc thành công! Session ID: ${sessionId}`);

      setShowForm(false);
    } catch (err: any) {
      console.error("Create session error:", err);
      alert(`⚠️ Tạo phiên sạc thất bại: ${err?.message || err}`);
    }
  };

  const handlePortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const portId = Number(e.target.value);
    const port = ports.find(p => p.PortId === portId);
    if (!port) {
      setForm(prev => ({ ...prev, portId: "", portType: "", kwh: "", price: "" }));
      return;
    }
    setForm(prev => ({
      ...prev,
      portId: String(port.PortId),
      portType: port.PortType,
      kwh: String(port.PortTypeOfKwh),
      price: String(port.PortTypePrice),
    }));
  };

  const handleBatteryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, battery: e.target.value }));
  };

  const renderStatus = (s?: string) =>
    s === "AVAILABLE" ? "Còn trống" : s === "BUSY" ? "Đang sạc" : "Bảo trì";

  return (
    <div className="location-wrapper">
      <StaffSideBar />
      <div className={`location-main-wrapper ${fadeIn ? "fade-in" : "hidden"}`}>
        <main className="location-main">
          <header className="location-header">
            <h1>Chi tiết trạm sạc</h1>
            <div className="location-header-actions"><ProfileStaff /></div>
          </header>

          <section className="detail-body">
            {station && (
              <>
                <h2>{station.StationName}</h2>
                <p><b>Địa chỉ:</b> {station.Address}</p>
                <p><b>Tổng số trụ:</b> {station.ChargingPointTotal}</p>
              </>
            )}

            <div className="charger-grid">
              {chargers.map(ch => (
                <div
                  key={ch.PointId}
                  className={`charger-card ${ch.ChargingPointStatus?.toLowerCase()}`}
                  onClick={() => openForm(ch)}
                >
                  <h3>Điểm #{ch.PointId}</h3>
                  <p>{renderStatus(ch.ChargingPointStatus)}</p>
                </div>
              ))}
            </div>

            {showForm && (
              <div className="booking-form-overlay">
                <form className="booking-form" onSubmit={handleSubmit}>
                  <h2>Đặt phiên sạc</h2>

                  {/* Chọn loại người dùng */}
                  <div className="user-type-select">
                    <label>Loại người dùng:</label>
                    <select
                      value={userType}
                      onChange={(e) =>
                        setUserType(e.target.value as "EV-Driver" | "Guest")
                      }
                    >
                      <option value="EV-Driver">EV-Driver</option>
                      <option value="Guest">Guest</option>
                    </select>
                  </div>

                  {/* Form EV-Driver */}
                  {userType === "EV-Driver" && (
                    <>
                      <label>Biển số xe</label>
                      <div className="lookup-row">
                        <input
                          value={form.licensePlate}
                          onChange={handleLicenseChange}
                          required
                        />
                        <button type="button" onClick={handleLookupCompany}>
                          Tra cứu
                        </button>
                      </div>

                      {form.displayName && <p><b>{form.displayName}</b></p>}
                    </>
                  )}

                  {/* Pin */}
                  <label>Số pin hiện tại (%)</label>
                  <input
                    type="number"
                    value={form.battery}
                    onChange={handleBatteryChange}
                    required
                  />

                  {/* Chọn cổng */}
                  <label>Chọn cổng sạc</label>
                  <select value={form.portId} onChange={handlePortSelect} required>
                    <option value="">-- Chọn cổng --</option>
                    {ports.map(p => (
                      <option key={p.PortId} value={p.PortId}>{p.PortType}</option>
                    ))}
                  </select>

                  {form.portId && (
                    <div className="port-info">
                      <p><b>Kwh:</b> {form.kwh}</p>
                      <p><b>Giá:</b> {form.price}₫</p>
                    </div>
                  )}

                  <div className="form-buttons">
                    <button type="submit" disabled={loadingSubmit}>
                      {loadingSubmit ? "Đang tạo..." : "Xác nhận"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default LocationDetail;
