import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { Modal, Button, Spinner } from "react-bootstrap";

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [txnRef, setTxnRef] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkPayment = async () => {
      const txn = searchParams.get("vnp_TxnRef");
      if (!txn) {
        setIsSuccess(false);
        setLoading(false);
        setShow(true);
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
        setShow(true);
      }
    };

    checkPayment();
  }, [searchParams]);

  const handleClose = () => {
    setShow(false);
    navigate("/booking-online-station");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isSuccess ? "✅ Thanh toán thành công" : "❌ Thanh toán thất bại"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {loading && (
          <>
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang kiểm tra trạng thái thanh toán...</p>
          </>
        )}

        {!loading && isSuccess && (
          <>
            <p>Giao dịch của bạn đã được xác nhận thành công!</p>
            <p>
              <strong>Mã giao dịch:</strong> {txnRef}
            </p>
          </>
        )}

        {!loading && isSuccess === false && (
          <p>Thanh toán không thành công hoặc bị hủy. Vui lòng thử lại.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Quay lại đặt lịch
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentResult;
