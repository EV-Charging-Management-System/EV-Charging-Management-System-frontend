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

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (!station?.StationId) {
      console.log("⚠️ Station or StationId is missing:", station);
      return;
    }
    console.log("🔹 Fetching charging points for StationId:", station.StationId);
    setLoadingChargers(true);
    (async () => {
      try {
        const list = await chargingPointService.getByStationId(station.StationId);
        console.log("✅ Charging points received:", list);
        console.log("📊 Number of points:", list.length);
        setChargers(list);
      } catch (error) {
        console.error("❌ Error fetching charging points:", error);
        alert("⚠️ Lỗi khi lấy danh sách điểm sạc");
      } finally {
        setLoadingChargers(false);
      }
    })();
  }, [station]);

  const openForm = async (charger: ChargingPoint) => {
    if (charger.ChargingPointStatus?.toLowerCase() !== "available") {
      return alert("⚠️ Điểm đang bận!");
    }
    setSelectedCharger(charger);
    setShowForm(true);
    setUserType("EV-Driver");

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
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      licensePlate: e.target.value,
      displayName: "",
      battery: "",
    }));
  };

  const handleLookupCompany = async () => {
    const plate = form.licensePlate.trim();
    if (!plate) return alert("⚠️ Nhập biển số xe!");

    try {
      const v = await vehicleService.getVehicleByLicensePlate(plate);
      if (!v || !v.userId) {
        setForm(prev => ({ ...prev, displayName: "", battery: "", userId: "" }));
        return alert("⚠️ Xe chưa đăng ký trong hệ thống!\n\nVui lòng nhập % pin thủ công để tiếp tục.");
      }

      let display = `UserId: ${v.userId} - Xe: ${v.licensePlate}`;
      if (v.companyName) {
        display = `Công ty: ${v.companyName} - UserId: ${v.userId}`;
      } else if (v.userName) {
        display = `Khách hàng: ${v.userName} - UserId: ${v.userId}`;
      }
      
      if (v.battery) {
        display += ` - Pin: ${v.battery}%`;
      }

      setForm(prev => ({
        ...prev,
        displayName: display,
        battery: v.battery ? String(v.battery) : "",
        userId: v.userId ? String(v.userId) : "",
      }));
      
      console.log("✅ Tra cứu thành công:");
      console.log("   - userId:", v.userId);
      console.log("   - licensePlate:", v.licensePlate);
      console.log("   - companyName:", v.companyName);
      console.log("   - userName:", v.userName);
      console.log("   - battery:", v.battery);
      
      if (!v.battery) {
        alert("✅ Tra cứu thành công!\n\n⚠️ Xe chưa có thông tin % pin trong hệ thống.\nVui lòng nhập % pin thủ công.");
      } else {
        alert("✅ Tra cứu thành công!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi tra cứu:", error);
      alert(`⚠️ Lỗi tra cứu xe: ${error.message || error}\n\nVui lòng thử lại hoặc nhập thông tin thủ công.`);
    }
  };

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
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("⚠️ Phiên đăng nhập đã hết hạn — vui lòng đăng nhập lại");
        window.location.href = "/login";
        return;
      }

      const requestBody: any = {
        licensePlate,
        stationId,
        pointId,
        portId,
        batteryPercentage: battery,
      };

      if (userId) {
        requestBody.userId = Number(userId);
        console.log("✅ Gửi userId kèm request:", userId);
      }

      const res = await fetch(`${API_BASE_URL}/staff/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Server error");

      const sessionId = data?.data?.sessionId || data?.sessionId;
      if (sessionId && userId) {
        const userIdSessionKey = `session_${sessionId}_userId`;
        localStorage.setItem(userIdSessionKey, userId);
        console.log(`💾 Saved userId to localStorage: ${userIdSessionKey} = ${userId}`);
      }

      return data;
    } finally {
      setLoadingSubmit(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharger || !form.portId) {
      return alert("⚠️ Điền đủ thông tin");
    }

    try {
      let sessionData;

      if (userType === "EV-Driver") {
        if (!form.licensePlate) return alert("⚠️ Nhập biển số xe");
        
        console.log("🚗 Creating EV-Driver session:");
        console.log("   - LicensePlate:", form.licensePlate);
        console.log("   - UserId:", form.userId);
        
        sessionData = await createChargingSession(
          form.licensePlate,
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0,
          form.userId
        );
        
        const sessionId = sessionData?.data?.sessionId ?? sessionData?.sessionId ?? "unknown";
        const userInfo = form.userId ? `UserId: ${form.userId}` : 'Xe chưa đăng ký (Guest mode)';
        alert(`✅ Tạo phiên sạc thành công!\n\nXe: ${form.licensePlate}\n${userInfo}\nSession ID: ${sessionId}\n\n⚠️ % Pin sẽ được nhập khi bắt đầu sạc.\n✅ Hóa đơn sẽ được tạo sau khi kết thúc sạc.`);
        
        // Navigate to Charging Process page
        navigate('/staff/charging-process');
      } else {
        console.log("👤 Creating Guest session");
        sessionData = await createChargingSessionGuest(
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0
        );
        
        const sessionId = sessionData?.data?.sessionId ?? sessionData?.sessionId ?? "unknown";
        alert(`✅ Tạo phiên sạc thành công!\n\nKhách vãng lai (Guest)\nSession ID: ${sessionId}\n\n⚠️ % Pin sẽ được nhập khi bắt đầu sạc.\n⚠️ Thu tiền mặt sau khi kết thúc.`);
        
        // Navigate to Charging Process page
        navigate('/staff/charging-process');
      }

      setChargers(prev =>
        prev.map(c =>
          c.PointId === selectedCharger.PointId ? { ...c, ChargingPointStatus: "BUSY" } : c
        )
      );

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
              <div className="staff-booking-form-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) setShowForm(false);
              }}>
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
                      <option value="Guest">� Khách vãng lai (Guest)</option>
                    </select>
                  </div>

                  {/* Biển số xe - Chỉ hiện khi chọn EV-Driver */}
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

                      {/* Thông tin tra cứu */}
                      {form.displayName && (
                        <div className="staff-lookup-result">
                          <p>✅ {form.displayName}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chọn cổng sạc */}
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

                  {/* Thông tin cổng sạc */}
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

                  {/* Buttons */}
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
