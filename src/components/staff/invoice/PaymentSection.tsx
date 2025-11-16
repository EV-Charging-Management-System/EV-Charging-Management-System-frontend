import React from 'react';
import { Button, Alert } from 'react-bootstrap';

interface PaymentSectionProps {
  paid: boolean;
  loading: boolean;
  error: string | null;
  onPayment: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ 
  paid, 
  loading, 
  error, 
  onPayment 
}) => {
  if (paid) {
    return (
      <Alert variant="success" className="paid-text">
        ✅ Đã thanh toán
      </Alert>
    );
  }

  return (
    <>
      <h3 className="choose-method-title">Xác nhận thanh toán</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button 
        onClick={onPayment} 
        disabled={loading} 
        variant="success"
        size="lg"
        className="pay-btn w-100"
      >
        {loading ? "⏳ Đang xử lý..." : "💰 Thanh toán"}
      </Button>
    </>
  );
};

export default PaymentSection;
