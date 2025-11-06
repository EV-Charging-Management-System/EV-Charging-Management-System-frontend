import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Badge,
  Container,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClock,
  FaCar,
  FaMoneyBill,
  FaHashtag,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import bookingService from "../../services/bookingService";
import { authService } from "../../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/ChargingSchedule.css";

const ChargingSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const profile = await authService.getProfile();
        const user = profile?.data || profile?.user || profile;
        const userId = user?.id || user?.userId;

        if (!userId) {
          console.warn("⚠️ Không tìm thấy userId!");
          setLoading(false);
          return;
        }

        const res = await bookingService.getBookingByUser(userId);
        const list = res?.data || [];

        const formatted = list.map((b: any) => ({
          id: b.BookingId,
          stationName: b.StationName || "Trạm Sạc",
          startTime: new Date(b.StartTime).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          vehicle: b.VehicleName || "Chưa cập nhật",
          plate: b.LicensePlate || "N/A",
          deposit: b.DepositAmount?.toLocaleString("vi-VN") + " ₫",
          qr: b.QR?.substring(0, 8) || "N/A",
          status:
            b.Status === "ACTIVE"
              ? "Đã xác nhận"
              : b.Status === "CANCELLED"
              ? "Đã hủy"
              : "Đang xử lý",
        }));

        setBookings(formatted);
      } catch (error) {
        console.error("❌ Lỗi tải danh sách booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = (id: number) => {
    if (window.confirm("Bạn có chắc muốn hủy lịch này?")) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleStartCharging = (booking: any) => {
    navigate("/charging-session", { state: { booking } });
  };

  return (
    <div className="schedule-container bg-dark text-light min-vh-100">
      <Header />
      <MenuBar />

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-warning mb-1">Lịch Đặt Sạc</h2>
            <p className="text-secondary">
              Theo dõi và quản lý lịch đặt sạc của bạn
            </p>
          </div>
          <Button
            variant="warning"
            onClick={() => navigate("/booking-online-station")}
          >
            + Đặt Lịch Mới
          </Button>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center text-muted">Hiện chưa có lịch sạc nào.</p>
        ) : (
          bookings.map((b) => (
            <Card
              key={b.id}
              className="mb-4 shadow-sm bg-secondary bg-opacity-10 border border-warning"
            >
              <Card.Body className="d-flex justify-content-between flex-wrap">
                {/* Thông tin bên trái */}
                <div>
                  <Card.Title className="text-warning mb-3">
                    <FaMapMarkerAlt className="me-2" />
                    {b.stationName}
                  </Card.Title>

                  <p className="mb-1">
                    <FaCalendarAlt className="me-2" /> {b.startTime}
                  </p>

                  <p className="mb-1">
                    <FaCar className="me-2" /> {b.vehicle} – {b.plate}
                  </p>

                  <p className="mb-1">
                    <FaMoneyBill className="me-2" /> {b.deposit}
                  </p>

                  <p className="mb-0">
                    <FaHashtag className="me-2" /> Mã đặt:{" "}
                    <strong>#{b.qr}</strong>
                  </p>
                </div>

                {/* Thông tin bên phải */}
                <div className="text-end mt-3 mt-md-0">
                  <Badge
                    bg={
                      b.status === "Đã xác nhận"
                        ? "success"
                        : b.status === "Đã hủy"
                        ? "danger"
                        : "warning"
                    }
                    text={b.status === "Đang xử lý" ? "dark" : "light"}
                    className="mb-2"
                  >
                    {b.status}
                  </Badge>

                  <div className="d-flex gap-2 justify-content-end">
                    {b.status === "Đã xác nhận" && (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleStartCharging(b)}
                      >
                        Bắt đầu sạc
                      </Button>
                    )}

                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default ChargingSchedule;