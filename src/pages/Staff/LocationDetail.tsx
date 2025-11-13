// src/pages/location/LocationDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    userId: "",
  });

  const [loadingStation, setLoadingStation] = useState(false);
  const [loadingChargers, setLoadingChargers] = useState(false);
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // ⭐ Fade in
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ⭐ Load station info
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

  // ⭐ Load charging points
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

  // ⭐ Reset userType mỗi khi mở form (cách đúng — không gây re-render infinite)
  useEffect(() => {
    if (showForm) {
      setUserType("EV-Driver");
    }
  }, [showForm]);

  // ⭐ Mở form đặt lịch
  const openForm = async (charger: ChargingPoint) => {
    if (charger.ChargingPointStatus?.toLowerCase() !== "available") {
      return alert("⚠️ Điểm đang bận!");
    }

    setSelectedCharger(charger);
    setShowForm(true);

    // Reset form
    setForm({
      licensePlate: "",
      displayName: "",
      battery: "",
      portId: "",
      portType: "",
      kwh: "",
      price: "",
      userId: "",
    });

    // Load ports
    setLoadingPorts(true);
    try {
      const portsList = await chargingPointService.getPortsByPoint(charger.PointId);
      setPorts(Array.isArray(portsList) ? portsList : []);
    } catch {
      alert("⚠️ Lỗi lấy cổng sạc");
      setPorts([]);
    } finally {
      setLoadingPorts(false);
    }
  };

  // ⭐ Nhập biển số
  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      licensePlate: e.target.value,
      displayName: "",
      battery: "",
    }));
  };

  // ⭐ Tra cứu xe
  const handleLookupCompany = async () => {
    const plate = form.licensePlate.trim();
    if (!plate) return alert("⚠️ Nhập biển số xe!");

    try {
      const v = await vehicleService.getVehicleByLicensePlate(plate);

      if (!v || !v.userId) {
        setForm(prev => ({
          ...prev,
          displayName: "",
          battery: "",
          userId: "",
        }));
        return alert("⚠️ Xe chưa đăng ký. Hãy nhập % pin thủ công!");
      }

      let display = `UserId: ${v.userId} - Xe: ${v.licensePlate}`;

      if (v.companyName) display = `Công ty: ${v.companyName} - UserId: ${v.userId}`;
      if (v.userName) display = `Khách hàng: ${v.userName} - UserId: ${v.userId}`;

      if (v.battery) display += ` - Pin: ${v.battery}%`;

      setForm(prev => ({
        ...prev,
        displayName: display,
        battery: v.battery ? String(v.battery) : "",
        userId: v.userId ? String(v.userId) : "",
      }));

      alert("✅ Tra cứu thành công!");
    } catch (error: any) {
      alert(`⚠️ Lỗi tra cứu: ${error.message || error}`);
    }
  };

  // ⭐ Tạo session EV-Driver
  const createChargingSession = async (
    licensePlate: string,
    stationId: number,
    pointId: number,
    portId: number,
    battery: number,
    userId?: string
  ) => {
    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Hết hạn đăng nhập!");

      const body: any = {
        licensePlate,
        stationId,
        pointId,
        portId,
        batteryPercentage: battery,
      };

      if (userId) body.userId = Number(userId);

      const res = await fetch(`${API_BASE_URL}/staff/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const sessionId = data.data?.sessionId;
      if (sessionId && userId) {
        localStorage.setItem(`session_${sessionId}_userId`, userId);
      }

      return data;
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ⭐ Tạo session Guest
  const createChargingSessionGuest = async (
    stationId: number,
    pointId: number,
    portId: number,
    battery: number
  ) => {
    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Hết hạn đăng nhập!");

      const res = await fetch(`${API_BASE_URL}/guest/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      if (!res.ok) throw new Error(data.message);

      return data;
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ⭐ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCharger || !form.portId)
      return alert("⚠️ Chọn cổng sạc trước!");

    try {
      let sessionData;

      if (userType === "EV-Driver") {
        if (!form.licensePlate) return alert("⚠️ Nhập biển số!");

        sessionData = await createChargingSession(
          form.licensePlate,
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0,
          form.userId
        );

        alert("✅ Tạo phiên sạc EV-Driver thành công!");
      } else {
        sessionData = await createChargingSessionGuest(
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0
        );

        alert("✅ Tạo phiên sạc Guest thành công!");
      }

      setShowForm(false);
      navigate("/staff/charging-process");
    } catch (err: any) {
      alert(`⚠️ Lỗi tạo phiên sạc: ${err.message}`);
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
              <div
                className="staff-booking-form-overlay"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowForm(false);
                }}
              >
                <form className="staff-booking-form" onSubmit={handleSubmit}>
                  <h2>⚡ Đặt Phiên Sạc</h2>

                  {/* Loại người dùng */}
                  <div className="staff-form-group">
                    <label>Loại người dùng</label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as "EV-Driver" | "Guest")}
                      className="staff-form-select"
                    >
                      <option value="EV-Driver">🚗 Có tài khoản (EV-Driver)</option>
                      <option value="Guest">👤 Khách vãng lai (Guest)</option>
                    </select>
                  </div>

                  {/* Biển số xe */}
                  {userType === "EV-Driver" && (
                    <div className="staff-form-group">
                      <label>Biển số xe</label>
                      <div className="staff-input-with-button">
                        <input
                          type="text"
                          placeholder="Nhập biển số xe (VD: 51A-12345)"
                          value={form.licensePlate}
                          onChange={handleLicenseChange}
                          required
                          className="staff-form-input staff-large-input"
                        />

                        <button
                          type="button"
                          className="staff-lookup-button"
                          onClick={handleLookupCompany}
                        >
                          🔍 Tra cứu
                        </button>
                      </div>

                      {form.displayName && (
                        <div className="staff-lookup-result">
                          <p>✅ {form.displayName}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cổng sạc */}
                  <div className="staff-form-group">
                    <label>Chọn cổng sạc</label>
                    <select
                      value={form.portId}
                      onChange={handlePortSelect}
                      required
                      className="staff-form-select"
                    >
                      <option value="">-- Chọn cổng sạc --</option>
                      {ports.map(p => (
                        <option key={p.PortId} value={p.PortId}>
                          {p.PortType} - {p.PortTypeOfKwh} kWh
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Info port */}
                  {form.portId && (
                    <div className="staff-port-details">
                      <div className="staff-detail-row">
                        <span>⚡ Công suất:</span>
                        <strong>{form.kwh} kWh</strong>
                      </div>
                      <div className="staff-detail-row">
                        <span>💰 Giá:</span>
                        <strong>{Number(form.price).toLocaleString()} ₫/kWh</strong>
                      </div>
                    </div>
                  )}

                  <div className="staff-form-actions">
                    <button
                      type="submit"
                      className="staff-btn-submit"
                      disabled={loadingSubmit}
                    >
                      {loadingSubmit ? "⏳ Đang xử lý..." : "✅ Xác nhận"}
                    </button>

                    <button
                      type="button"
                      className="staff-btn-cancel"
                      onClick={() => setShowForm(false)}
                    >
                      ❌ Hủy
                    </button>
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
