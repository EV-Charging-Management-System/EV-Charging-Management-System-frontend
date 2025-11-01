import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSideBar from "../../pages/layouts/staffSidebar";
import locationService from "../../services/locationService";
import type { Station } from "../../services/locationService";
import chargingPointService from "../../services/chargingpointService";
import type { ChargingPoint } from "../../services/chargingpointService";
import "../../css/LocationDetail.css";

interface OfflineSession {
  id: number;
  StationName: string;
  chargerName: string;
  power: string;
  customer: string;
  phone: string;
  carBrand: string;
  status: string;
}

const LocationDetail: React.FC = () => {
  // ✅ param phải là address, không phải id
  const { address } = useParams();
  const decodedAddress = decodeURIComponent(address || "");

  const [showContent, setShowContent] = useState(false);
  const [stationInfo, setStationInfo] = useState<Station | null>(null);
  const [chargersData, setChargersData] = useState<ChargingPoint[]>([]);
  const [selectedCharger, setSelectedCharger] = useState<ChargingPoint | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    carBrand: "VinFast",
  });

  // ✅ hiệu ứng fade-in
  useEffect(() => {
    setTimeout(() => setShowContent(true), 150);
  }, []);

  // ✅ lấy detail trạm bằng Address
  useEffect(() => {
    if (!decodedAddress) return;

    const fetchStation = async () => {
      try {
        const station = await locationService.getStationInfo(decodedAddress);
        if (station) setStationInfo(station);
      } catch (err) {
        console.error("❌ Failed to load station info:", err);
      }
    };

    fetchStation();
  }, [decodedAddress]);

  // ✅ lấy danh sách cổng sạc theo StationId
  useEffect(() => {
    if (!stationInfo?.StationId) return;

    const fetchPoints = async () => {
      try {
        const points = await chargingPointService.getByStationId(stationInfo.StationId);
        setChargersData(points);
      } catch (err) {
        console.error("❌ Failed to load charging points:", err);
      }
    };

    fetchPoints();
  }, [stationInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharger || !stationInfo) return;

    const newSession: OfflineSession = {
      id: Date.now(),
      StationName: stationInfo.StationName,
      chargerName: selectedCharger.Name ?? `Point #${selectedCharger.PointId}`,
      power: selectedCharger.Power ?? "N/A",
      customer: formData.fullName,
      phone: formData.phone,
      carBrand: formData.carBrand,
      status: "pending",
    };

    const existing = JSON.parse(localStorage.getItem("offlineSessions") || "[]");
    localStorage.setItem("offlineSessions", JSON.stringify([...existing, newSession]));

    setChargersData(prev =>
      prev.map(c =>
        c.PointId === selectedCharger.PointId ? { ...c, ChargingPointStatus: "BUSY" } : c
      )
    );

    setSelectedCharger(null);
    setFormData({ fullName: "", phone: "", carBrand: "VinFast" });
    alert("✅ Đặt phiên sạc offline thành công!");
  };

  const renderStatus = (s: string) => {
    if (!s) return "Không rõ";
    switch (s.toLowerCase()) {
      case "available": return "Còn trống";
      case "busy": return "Đang sạc";
      default: return "Bảo trì";
    }
  };

  const openForm = (charger: ChargingPoint) => {
    if (charger.ChargingPointStatus?.toLowerCase() === "available") {
      setSelectedCharger(charger);
    }
  };

  return (
    <div className="location-wrapper">
      <StaffSideBar />

      <div className={`location-main-wrapper ${showContent ? "fade-in" : "hidden"}`}>
        <main className="location-main">
          
          <header className="location-header">
            <h1>Chi tiết trạm sạc</h1>
            <div className="location-header-actions">
              <ProfileStaff />
            </div>
          </header>

          <section className="detail-body">
            {stationInfo ? (
              <>
                <h2 className="detail-title">{stationInfo.StationName}</h2>
                <p className="detail-sub">{stationInfo.StationDescrip}</p>
                <p><b>Địa chỉ:</b> {stationInfo.Address}</p>
                <p><b>Trạng thái:</b> {stationInfo.StationStatus}</p>
                <p><b>Tổng số trụ sạc:</b> {stationInfo.ChargingPointTotal}</p>
              </>
            ) : (
              <p>⏳ Đang tải thông tin trạm...</p>
            )}

            <div className="charger-grid">
              {chargersData.length === 0 && <p>Không có trụ sạc</p>}

              {chargersData.map(charger => (
                <div
                  key={charger.PointId}
                  className={`charger-card ${charger.ChargingPointStatus?.toLowerCase()}`}
                  onClick={() => openForm(charger)}
                >
                  <h3>Điểm #{charger.PointId}</h3>
                  <p className="charger-status">{renderStatus(charger.ChargingPointStatus)}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LocationDetail;
