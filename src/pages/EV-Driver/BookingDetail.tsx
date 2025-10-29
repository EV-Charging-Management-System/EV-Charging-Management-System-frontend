import React, { useState, useEffect } from "react";
import "../../css/BookingDetail.css";
import { useParams } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import mapImage from "../../assets/mapdetailbook.jpg";
import bookingService from "../../services/bookingService";
import { authService } from "../../services/authService";

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const stationId = Number(id);

  const [points, setPoints] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
  const [selectedPortId, setSelectedPortId] = useState<number | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    email: "",
    carBrand: "",
    vehicleId: "",
    time: "",
  });

  // ===== Load user info =====
  useEffect(() => {
    (async () => {
      try {
        const profile = await authService.getProfile();
        const user = profile?.user || profile?.data || profile;
        setFormData((prev) => ({
          ...prev,
          name: user?.fullName || "",
          userId: String(user?.userId || user?.id || ""),
          email: user?.email || "",
        }));
      } catch (e) {
        console.error("Không thể load profile:", e);
      }
    })();
  }, []);

  // ===== Load points theo station =====
  useEffect(() => {
    if (!stationId || Number.isNaN(stationId)) return;
    (async () => {
      try {
        const res = await bookingService.getPoints(stationId);
        console.log("[BookingDetail] Points loaded:", res);
        setPoints(res);
      } catch (err) {
        console.error("Lỗi load điểm sạc:", err);
      }
    })();
  }, [stationId]);

  // ===== Load ports theo pointId =====
  useEffect(() => {
    if (!selectedPointId) return;
    (async () => {
      try {
        const res = await bookingService.getPorts(selectedPointId);
        console.log("[BookingDetail] Ports loaded:", res);
        setPorts(res);
        const firstAvailable = res.find(
          (p: any) =>
            (p.PortStatus || p.portStatus || "").toUpperCase() === "AVAILABLE"
        );
        if (firstAvailable) {
          setSelectedPortId(firstAvailable.PortId ?? firstAvailable.portId);
        }
      } catch (err) {
        console.error("Lỗi load port:", err);
      }
    })();
  }, [selectedPointId]);

  // ===== Gửi booking & redirect tới VNPay =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPointId || !selectedPortId) {
      alert("Vui lòng chọn cổng sạc!");
      return;
    }

    try {
      setPayLoading(true);

      const todayStr = new Date().toISOString().split("T")[0];
      const startTime = formData.time
        ? new Date(`${todayStr}T${formData.time}`).toISOString()
        : new Date().toISOString();

      const payload = {
        stationId,
        pointId: selectedPointId,
        portId: selectedPortId,
        vehicleId: Number(formData.vehicleId) || 1,
        startTime,
        depositAmount: 50000,
      };

      console.log("[BookingDetail] Payload gửi booking:", payload);

      // 🟢 Gọi API backend
      const res = await bookingService.createBooking(payload);
      console.log("[BookingDetail] API booking trả về:", res);

      // 🟢 Lấy URL chính xác từ response
      let redirectUrl: string | null = null;
      if (typeof res === "string") {
        redirectUrl = res;
      } else if (res?.data?.url) {
        redirectUrl = res.data.url;
      } else if (res?.url) {
        redirectUrl = res.url;
      }

      // 🟢 Nếu có URL → chuyển hướng ngay
      if (redirectUrl) {
        console.log("[BookingDetail] Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
        return;
      }

      alert("Không nhận được URL thanh toán từ hệ thống!");
    } catch (error: any) {
      console.error("[BookingDetail] Lỗi khi tạo booking:", error);
      alert(error?.message || "Không thể tạo booking!");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <Header />
      <MenuBar />

      <main className="booking-detail-body">
        <div className="detail-layout">
          <div className="map-detail">
            <img src={mapImage} alt="map" className="map-image" />
          </div>

          <div className="form-section">
            <form className="booking-form" onSubmit={handleSubmit}>
              <h2>Đặt Lịch Sạc</h2>

              <label>Họ và tên</label>
              <input type="text" value={formData.name} readOnly />

              <label>Email</label>
              <input type="email" value={formData.email} readOnly />

              <label>Hãng xe</label>
              <select
                value={formData.carBrand}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carBrand: e.target.value,
                    vehicleId:
                      e.target.value === "VinFast"
                        ? "1"
                        : e.target.value === "Hyundai"
                        ? "2"
                        : e.target.value === "Tesla"
                        ? "3"
                        : "",
                  })
                }
                required
              >
                <option value="">Chọn hãng xe</option>
                <option value="VinFast">VF e34</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Tesla">Tesla</option>
              </select>

              <label>Giờ đến sạc</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />

              <label>Cổng sạc</label>
              <select
                value={selectedPortId ?? ""}
                onChange={(e) => setSelectedPortId(Number(e.target.value))}
                required
              >
                <option value="">Chọn port</option>
                {ports.map((pt: any) => {
                  const id = pt.PortId ?? pt.portId;
                  const type = pt.PortType ?? pt.portType;
                  return (
                    <option key={id} value={id}>
                      {type ? `${type} (Port ${id})` : `Port ${id}`}
                    </option>
                  );
                })}
              </select>

              <div className="form-buttons">
                <button type="submit" className="submit-btn" disabled={payLoading}>
                  {payLoading ? "Đang xử lý..." : "Thanh toán"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ==== DANH SÁCH CỔNG SẠC ==== */}
        <section className="station-grid">
          <h3>Chọn Cổng Sạc</h3>
          <div className="grid-container">
            {points.map((p: any) => {
              const cls =
                (p.ChargingPointStatus || "").toUpperCase() === "AVAILABLE"
                  ? "available"
                  : "booked";
              return (
                <div
                  key={p.PointId}
                  className={`station-box ${cls} ${
                    selectedPointId === p.PointId ? "active" : ""
                  }`}
                  onClick={() => {
                    if (cls !== "available") return;
                    setSelectedPointId(p.PointId);
                  }}
                >
                  <h4>#{p.PointId}</h4>
                  <p>{cls === "available" ? "Còn trống" : "Đã đặt / Bảo trì"}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetail;
