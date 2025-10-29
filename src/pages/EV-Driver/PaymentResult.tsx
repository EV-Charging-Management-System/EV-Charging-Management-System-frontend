import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [txnRef, setTxnRef] = useState<string>("");
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
        console.log("[PaymentResult] Checking txn:", txn);
        const res = await bookingService.getBookingByTxn(txn);
        console.log("[PaymentResult] Response:", res);

        const status = res?.data?.Status;
        const deposit = res?.data?.DepositStatus;

        // ✅ Logic chính xác: chỉ khi ACTIVE + DepositStatus = true thì thành công
        if (status === "ACTIVE" && deposit === true) {
          setIsSuccess(true);
        } else {
          setIsSuccess(false);
        }

        setTxnRef(txn);
      } catch (err) {
        console.error("[PaymentResult] Error:", err);
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
    navigate("/booking");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isSuccess === true
            ? "✅ Thanh toán thành công"
            : isSuccess === false
            ? "❌ Thanh toán thất bại"
            : "Đang xử lý..."}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {loading && (
          <div>
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3">Đang kiểm tra trạng thái thanh toán...</p>
          </div>
        )}

        {!loading && isSuccess === true && (
          <div>
            <BsCheckCircleFill color="green" size={60} />
            <h5 className="mt-3">Thanh toán thành công!</h5>
            <p>
              Giao dịch của bạn đã được xác nhận thành công.
              <br />
              <strong>Mã giao dịch:</strong> {txnRef}
            </p>
            <Alert variant="success">Trạng thái: ACTIVE</Alert>
          </div>
        )}

        {!loading && isSuccess === false && (
          <div>
            <BsXCircleFill color="red" size={60} />
            <h5 className="mt-3">Thanh toán thất bại!</h5>
            <p>
              Thanh toán không thành công hoặc bị hủy.
              <br />
              Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>
            <Alert variant="danger">Trạng thái: PENDING</Alert>
          </div>
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
