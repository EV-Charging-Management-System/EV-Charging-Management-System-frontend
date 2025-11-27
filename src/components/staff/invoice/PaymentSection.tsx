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
        ✅ Paid
      </Alert>
    );
  }

  return (
    <>
      <h3 className="choose-method-title">Confirm Payment</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button 
        onClick={onPayment} 
        disabled={loading} 
        variant="success"
        size="lg"
        className="pay-btn w-100"
      >
        {loading ? "⏳ Processing..." : "💰 Pay"}
      </Button>
    </>
  );
};

export default PaymentSection;
