import React from "react";
import { Container } from "react-bootstrap";
import "../../css/Invoice.css";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSideBar from "../../pages/layouts/staffSidebar";
import { 
  InvoiceDetail, 
  InvoiceList, 
  PaymentSection 
} from "../../components/staff/invoice";
import { useInvoice } from "../../components/staff/invoice/useInvoice";

const Invoice: React.FC = () => {
  const {
    invoice,
    invoices,
    paid,
    loading,
    error,
    handlePayment,
  } = useInvoice();

  return (
    <div className="charging-wrapper">
      <StaffSideBar />

      <div className="charging-main-wrapper fade-in">
        <header className="charging-header">
          <h1>Hóa đơn sạc xe</h1>
          <div className="charging-header-actions">
            <ProfileStaff />
          </div>
        </header>

        <main className="invoice-body">
          <Container className="invoice-container">
            {invoice && (
              <>
                <InvoiceDetail invoice={invoice} />
                <PaymentSection
                  paid={paid}
                  loading={loading}
                  error={error}
                  onPayment={handlePayment}
                />
              </>
            )}

            {invoices.length > 0 && <InvoiceList invoices={invoices} />}
            
            {!invoice && invoices.length === 0 && (
              <p className="text-center text-muted">Chưa có hóa đơn nào.</p>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Invoice;
