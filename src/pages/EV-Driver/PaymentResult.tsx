import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { Container, Card, Button, Spinner } from "react-bootstrap";

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [txnRef, setTxnRef] = useState("");

  useEffect(() => {
    const checkPayment = async () => {
      const txn = searchParams.get("vnp_TxnRef");
      if (!txn) {
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      try {
        const res = await bookingService.getBookingByTxn(txn);
        const status = res?.data?.Status;
        const deposit = res?.data?.DepositStatus;

        if (status === "ACTIVE" && deposit === true) {
          setIsSuccess(true);
        } else {
          setIsSuccess(false);
        }

        setTxnRef(txn);
      } catch (err) {
        console.error("Lỗi kiểm tra thanh toán:", err);
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [searchParams]);

  const handleBack = () => navigate("/booking-online-station");

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundColor: "#0B0C10",
        color: "#f8f9fa",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="text-center shadow-lg p-4 border-0"
          style={{
            width: "420px",
            borderRadius: "18px",
            background: "linear-gradient(145deg, #1E1E2F, #151621)",
          }}
        >
          {loading ? (
            <>
              <Spinner animation="border" variant="light" />
              <p className="mt-3 text-secondary">
                Đang kiểm tra trạng thái thanh toán...
              </p>
            </>
          ) : isSuccess ? (
            <>
              <div
                className="mx-auto mb-3 rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: "#16a34a20",
                  border: "2px solid #16a34a",
                }}
              >
                <i
                  className="bi bi-check2"
                  style={{ color: "#16a34a", fontSize: "2rem" }}
                ></i>
              </div>

              <h4 className="fw-bold text-success">Thanh toán thành công</h4>
              <p className="text-secondary mt-3 mb-1">
                Giao dịch của bạn đã được xác nhận thành công!
              </p>
              <p className="text-info mb-4">
                <strong>Mã giao dịch:</strong> {txnRef}
              </p>

              <Button
                variant="primary"
                className="px-4 rounded-pill"
                onClick={handleBack}
              >
                Quay lại đặt lịch
              </Button>
            </>
          ) : (
            <>
              <div
                className="mx-auto mb-3 rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: "#dc262620",
                  border: "2px solid #dc2626",
                }}
              >
                <i
                  className="bi bi-x"
                  style={{ color: "#dc2626", fontSize: "2rem" }}
                ></i>
              </div>

              <h4 className="fw-bold text-danger">Thanh toán thất bại</h4>
              <p className="text-secondary mt-3 mb-4">
                Thanh toán không thành công hoặc bị hủy. Vui lòng thử lại.
              </p>

              <Button
                variant="outline-light"
                className="px-4 rounded-pill"
                onClick={handleBack}
              >
                Quay lại đặt lịch
              </Button>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default PaymentResult;
