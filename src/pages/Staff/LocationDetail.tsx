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
    setForm((prev) => ({
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
        setForm((prev) => ({ ...prev, displayName: "", battery: "", userId: "" }));
        return alert("⚠️ Xe chưa đăng ký trong hệ thống!\n\nVui lòng nhập % pin thủ công để tiếp tục.");
      }

      let display = `UserId: ${v.userId} - Xe: ${v.licensePlate}`;
      if (v.companyName) {
        display = `Công ty: ${v.companyName} - UserId: ${v.userId}`;
      } else if (v.userName) {
        display = `Khách hàng: ${v.userName} - UserId: ${v.userId}`;
      }
      if (v.battery) display += ` - Pin: ${v.battery}%`;

      setForm((prev) => ({
        ...prev,
        displayName: display,
        battery: v.battery ? String(v.battery) : "",
        userId: v.userId ? String(v.userId) : "",
      }));

      if (!v.battery)
        alert("✅ Tra cứu thành công!\n\n⚠️ Xe chưa có thông tin % pin trong hệ thống.\nVui lòng nhập % pin thủ công.");
      else alert("✅ Tra cứu thành công!");
    } catch (error: any) {
      alert(`⚠️ Lỗi tra cứu xe: ${error.message || error}`);
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
        alert("⚠️ Phiên đăng nhập đã hết hạn");
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

      if (userId) requestBody.userId = Number(userId);

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
        localStorage.setItem(`session_${sessionId}_userId`, userId);
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
        alert("⚠️ Phiên đăng nhập đã hết hạn");
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
          batteryPercentage: battery, // ✅ gửi pin thật
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
    if (!selectedCharger || !form.portId) return alert("⚠️ Điền đủ thông tin");

    try {
      let sessionData;

      if (userType === "EV-Driver") {
        if (!form.licensePlate) return alert("⚠️ Nhập biển số xe");

        sessionData = await createChargingSession(
          form.licensePlate,
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0,
          form.userId
        );

        const sessionId = sessionData?.data?.sessionId ?? sessionData?.sessionId ?? "unknown";
        alert(`✅ Tạo phiên sạc thành công!\nXe: ${form.licensePlate}\nSession ID: ${sessionId}`);
      } else {
        const batteryValue = Number(form.battery);
        if (!batteryValue || batteryValue < 1 || batteryValue > 99) {
          alert("⚠️ Vui lòng nhập mức pin hợp lệ (1–99%)!");
          return;
        }

        sessionData = await createChargingSessionGuest(
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          batteryValue
        );

        const sessionId = sessionData?.data?.sessionId ?? sessionData?.sessionId ?? "unknown";
        alert(`✅ Tạo phiên sạc thành công!\nKhách vãng lai (Guest)\nPin ban đầu: ${batteryValue}%\nSession ID: ${sessionId}`);
      }

      setChargers((prev) =>
        prev.map((c) =>
          c.PointId === selectedCharger.PointId ? { ...c, ChargingPointStatus: "BUSY" } : c
        )
      );
      setShowForm(false);
    } catch (err: any) {
      alert(`⚠️ Tạo phiên sạc thất bại: ${err?.message || err}`);
    }
  };

  const handlePortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const portId = Number(e.target.value);
    const port = ports.find((p) => p.PortId === portId);
    if (!port) {
      setForm((prev) => ({ ...prev, portId: "", portType: "", kwh: "", price: "" }));
      return;
    }
    setForm((prev) => ({
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
            <div className="location-header-actions">
              <ProfileStaff />
            </div>
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
              {chargers.map((ch) => (
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

                  {/* Loại người dùng */}
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

                  {/* EV Driver */}
                  {userType === "EV-Driver" && (
                    <>
                      <label>Biển số xe</label>
                      <div className="lookup-row">
                        <input
                          type="text"
                          placeholder="Nhập biển số xe"
                          value={form.licensePlate}
                          onChange={handleLicenseChange}
                          required
                        />
                        <button type="button" onClick={handleLookupCompany}>
                          Tra cứu
                        </button>
                      </div>
                      {form.displayName && (
                        <p className="display-name"><b>{form.displayName}</b></p>
                      )}
                    </>
                  )}

                  {/* Guest input battery */}
                  {userType === "Guest" && (
                    <>
                      <label>🔋 Mức pin ban đầu (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        placeholder="Nhập % pin ban đầu..."
                        value={form.battery}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, battery: e.target.value }))
                        }
                        required
                      />
                    </>
                  )}

                  {/* Cổng sạc */}
                  <label>Chọn cổng sạc</label>
                  <select value={form.portId} onChange={handlePortSelect} required>
                    <option value="">-- Chọn cổng --</option>
                    {ports.map((p) => (
                      <option key={p.PortId} value={p.PortId}>
                        {p.PortType}
                      </option>
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
                    <button type="button" onClick={() => setShowForm(false)}>
                      Hủy
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
