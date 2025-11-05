import React, { useState, useEffect } from "react";
import "../../css/BookingDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import mapImage from "../../assets/mapdetailbook.jpg";
import bookingService from "../../services/bookingService";
import { authService } from "../../services/authService";

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const stationId = Number(id);
  const navigate = useNavigate();

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

  // ✅ Load thông tin người dùng
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
        console.error("❌ Không thể load profile:", e);
      }
    })();
  }, []);

  // ✅ Load danh sách điểm sạc theo trạm
  useEffect(() => {
    if (!stationId || Number.isNaN(stationId)) return;
    (async () => {
      try {
        const res = await bookingService.getPoints(stationId);
        console.log("[BookingDetail] Points loaded:", res);
        setPoints(res);
      } catch (err) {
        console.error("❌ Lỗi load điểm sạc:", err);
      }
    })();
  }, [stationId]);

  // ✅ Load danh sách cổng theo pointId
  useEffect(() => {
    if (!selectedPointId) return;
    (async () => {
      try {
        const res = await bookingService.getPorts(selectedPointId);
        console.log("[BookingDetail] Ports loaded:", res);
        setPorts(res);
        const firstAvailable = res.find(
          (p: any) => (p.PortStatus || p.portStatus || "").toUpperCase() === "AVAILABLE"
        );
        if (firstAvailable) setSelectedPortId(firstAvailable.PortId);
      } catch (err) {
        console.error("❌ Lỗi load port:", err);
      }
    })();
  }, [selectedPointId]);

  // ✅ Gửi booking → mở VNPay
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPointId || !selectedPortId) {
      alert("⚠️ Vui lòng chọn cổng sạc!");
      return;
    }
    if (!formData.userId) {
      alert("⚠️ Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
      return;
    }

    // 👉 Mở tab mới ngay khi user click (tránh bị chặn popup)
    const vnpayTab = window.open("", "_blank");

    try {
      setPayLoading(true);

      const todayStr = new Date().toISOString().split("T")[0];
      const startTime = formData.time
        ? new Date(`${todayStr}T${formData.time}`).toISOString()
        : new Date().toISOString();

      const bookingData = {
        stationId,
        pointId: selectedPointId,
        portId: selectedPortId,
        vehicleId: Number(formData.vehicleId) || 1,
        startTime,
        depositAmount: 30000,
        userId: Number(formData.userId),
        carBrand: formData.carBrand,
      };

      // 💾 Lưu localStorage để tạo booking sau khi thanh toán thành công
      localStorage.setItem("bookingPayload", JSON.stringify(bookingData));
      console.log("[BookingDetail] bookingPayload saved:", bookingData);

      // 💳 Gọi API VNPay tạo URL thanh toán cho Booking Deposit
      const vnpayPayload = {
        amount: 30000,
        stationId,
        portId: selectedPortId,
        orderInfo: `Đặt cọc trạm ${stationId}`,
      };

      console.log("[BookingDetail] Payload gửi VNPay Booking:", vnpayPayload);

      // ✅ Gọi endpoint mới: /api/vnpay/create-booking
      const res = await bookingService.createVnpayBooking(vnpayPayload);
      console.log("[BookingDetail] VNPay Booking response:", res);

      const paymentUrl =
        res?.data?.data?.vnpUrl ||
        res?.data?.vnpUrl ||
        res?.vnpUrl ||
        res?.url;

      if (paymentUrl) {
        vnpayTab!.location.href = paymentUrl;
      } else {
        alert("Không nhận được URL thanh toán từ hệ thống!");
        vnpayTab?.close();
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo thanh toán:", error);
      alert(error?.message || "Không thể tạo thanh toán!");
      vnpayTab?.close();
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

              <div
                style={{
                  margin: "20px 0",
                  padding: "15px",
                  backgroundColor: "#878c8fff",
                  border: "2px solid #202020ff",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1e40af",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Giá đặt cọc
                </label>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#e4e6ecff",
                  }}
                >
                  30,000 ₫
                </div>
              </div>

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
