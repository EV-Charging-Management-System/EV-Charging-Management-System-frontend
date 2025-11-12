// src/pages/location/LocationDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSideBar from "../../pages/layouts/staffSidebar";
import locationService from "../../services/locationService";
import type { Station } from "../../services/locationService";
import chargingPointService from "../../services/chargingpointService";
import type { ChargingPoint, ChargingPort } from "../../services/chargingpointService";
import { vehicleService } from "../../services/vehicleServiceStaff";
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
    userId: "", // ✅ Thêm userId để lưu khi tra cứu
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
      userId: "", // ✅ Reset userId
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

      // Tạo chuỗi hiển thị
      let display = `UserId: ${v.userId} - Xe: ${v.licensePlate}`;
      if (v.companyName) {
        display = `Công ty: ${v.companyName} - UserId: ${v.userId}`;
      } else if (v.userName) {
        display = `Khách hàng: ${v.userName} - UserId: ${v.userId}`;
      }
      
      // Nếu có battery thì thêm vào display
      if (v.battery) {
        display += ` - Pin: ${v.battery}%`;
      }

      setForm(prev => ({
        ...prev,
        displayName: display,
        battery: v.battery ? String(v.battery) : "", // ⚠️ Nếu không có battery, để trống để user nhập
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

  // Tạo phiên sạc EV-Driver gọi staff API với licensePlate và userId
  const createChargingSession = async (
    licensePlate: string,
    stationId: number,
    pointId: number,
    portId: number,
    battery: number,
    userId?: string // ✅ Thêm userId parameter
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

      // ✅ Nếu có userId từ tra cứu vehicle, gửi kèm để backend tạo invoice đúng user
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

      // ✅ Lưu userId vào localStorage với key là sessionId để dùng khi tạo invoice
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

  // Tạo phiên sạc Guest gọi API guest/start
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
        
        // ✅ Truyền userId vào để backend tạo invoice đúng user
        // Battery sẽ được nhập khi bắt đầu sạc
        sessionData = await createChargingSession(
          form.licensePlate,
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0, // Battery = 0, sẽ được cập nhật khi bắt đầu sạc
          form.userId // ✅ Gửi userId đã tra cứu được
        );
        
        const sessionId = sessionData?.data?.sessionId ?? sessionData?.sessionId ?? "unknown";
        const userInfo = form.userId ? `UserId: ${form.userId}` : 'Xe chưa đăng ký (Guest mode)';
        alert(`✅ Tạo phiên sạc thành công!\n\nXe: ${form.licensePlate}\n${userInfo}\nSession ID: ${sessionId}\n\n⚠️ % Pin sẽ được nhập khi bắt đầu sạc.\n✅ Hóa đơn sẽ được tạo sau khi kết thúc sạc.`);
      } else {
        console.log("👤 Creating Guest session");
        sessionData = await createChargingSessionGuest(
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0 // Battery = 0, sẽ được nhập khi bắt đầu sạc
        );
        
        const sessionId = sessionData?.data?.sessionId ?? sessionData?.sessionId ?? "unknown";
        alert(`✅ Tạo phiên sạc thành công!\n\nKhách vãng lai (Guest)\nSession ID: ${sessionId}\n\n⚠️ % Pin sẽ được nhập khi bắt đầu sạc.\n⚠️ Thu tiền mặt sau khi kết thúc.`);
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
                {/* Form EV-Driver */}
{userType === "EV-Driver" && (
  <>
    <label>Biển số xe</label>
    <div className="lookup-row">
      <input
        type="text"
        placeholder="Nhập biển số xe"
        value={form.licensePlate}
        onChange={handleLicenseChange} // ✅ fix handler
        required
      />
      <button type="button" onClick={handleLookupCompany}>
        Tra cứu
      </button>
    </div>

    {form.displayName && <p className="display-name"><b>{form.displayName}</b></p>}
  </>
)}

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
