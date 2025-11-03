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
  const [txnRef, setTxnRef] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    email: "",
    carBrand: "",
    vehicleId: "",
    time: "",
  });

  // 🟢 Load user info
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

  // 🟢 Load điểm sạc theo station
  useEffect(() => {
    if (!stationId || Number.isNaN(stationId)) return;
    (async () => {
      try {
        const res = await bookingService.getPoints(stationId);
        console.log("[BookingDetail] Points loaded:", res);
        setPoints(res?.data || res || []);
      } catch (err) {
        console.error("Lỗi load điểm sạc:", err);
      }
    })();
  }, [stationId]);

  // 🟢 Load port theo point
  useEffect(() => {
    if (!selectedPointId) return;
    (async () => {
      try {
        const res = await bookingService.getPorts(selectedPointId);
        console.log("[BookingDetail] Ports loaded:", res);
        setPorts(res?.data || res || []);
        const firstAvailable = (res?.data || res || []).find(
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

  // 🟢 Gửi booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPointId || !selectedPortId) {
      alert("Vui lòng chọn cổng sạc!");
      return;
    }

    const vnpayTab = window.open("", "_blank");
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
        userId: formData.userId,
        carBrand: formData.carBrand,
      };

      console.log("[BookingDetail] Payload gửi booking:", payload);
      const res = await bookingService.createBooking(payload);
      const paymentUrl = res?.data?.url || res?.url || null;
      const ref = res?.data?.txnRef || res?.txnRef || null;

      if (paymentUrl) {
        vnpayTab!.location.href = paymentUrl;
        setTxnRef(ref);
      } else {
        alert("Không nhận được URL thanh toán từ hệ thống!");
        vnpayTab?.close();
      }
    } catch (error: any) {
      console.error("[BookingDetail] Lỗi khi tạo booking:", error);
      alert(error?.message || "Không thể tạo booking!");
      vnpayTab?.close();
    } finally {
      setPayLoading(false);
    }
  };

  // 🟢 Polling kết quả thanh toán
  useEffect(() => {
    if (!txnRef) return;
    const interval = setInterval(async () => {
      try {
        const res = await bookingService.getBookingByTxn(txnRef);
        const status = res?.data?.Status;
        const deposit = res?.data?.DepositStatus;
        if (status === "ACTIVE" && deposit === true) {
          clearInterval(interval);
          navigate(`/payment-result?vnp_TxnRef=${txnRef}`);
        }
      } catch (err) {
        console.warn("[BookingDetail] Polling error:", err);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [txnRef, navigate]);

  return (
    <div className="booking-container">
      <Header />
      <MenuBar />

      <main className="booking-detail-body">
        <div className="detail-layout">
          <div className="map-detail">
            <img src={mapImage} alt="map" className="map-image" />
          </div>

          {/* ==== FORM ==== */}
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
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={payLoading}
                >
                  {payLoading ? "Đang xử lý..." : "Thanh toán"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ==== DANH SÁCH ĐIỂM SẠC ==== */}
        <section className="station-grid">
          <h3>Chọn Cổng Sạc</h3>
          <div className="grid-container">
            {points.length === 0 ? (
              <p>Không có điểm sạc nào tại trạm này.</p>
            ) : (
              points.map((p: any) => {
                const pointId =
                  p.PointId ?? p.ChargingPointId ?? p.id ?? Math.random();
                const status =
                  (p.Status ||
                    p.ChargingPointStatus ||
                    "").toUpperCase() || "UNKNOWN";
                const isAvailable = status === "AVAILABLE";
                const isActive = selectedPointId === pointId;

                return (
                  <div
                    key={pointId}
                    className={`station-box ${
                      isAvailable ? "available" : "booked"
                    } ${isActive ? "active" : ""}`}
                    onClick={() => {
                      if (!isAvailable) return;
                      setSelectedPointId(pointId);
                    }}
                  >
                    <h4>#{pointId}</h4>
                    <p>
                      {isAvailable
                        ? "Còn trống"
                        : status === "BUSY"
                        ? "Đang sạc"
                        : "Đã đặt / Bảo trì"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetail;
