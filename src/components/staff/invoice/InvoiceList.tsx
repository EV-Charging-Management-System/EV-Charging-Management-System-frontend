import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import type { InvoiceData } from './types';

interface InvoiceListProps {
  invoices: InvoiceData[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  if (invoices.length === 0) {
    return <p className="text-center text-muted">Chưa có hóa đơn nào.</p>;
  }

  return (
    <div>
      <h2 className="mb-3">Lịch sử hóa đơn</h2>
      {invoices.map(inv => (
        <Card key={inv.sessionId} className="invoice-box shadow-sm mb-3">
          <Card.Body>
            <p><strong>Hóa đơn #{inv.sessionId}</strong></p>
            <p>Trạm: {inv.stationName}</p>
            <p>Charger: {inv.chargerName} ({inv.power})</p>
            <p>Khách: {inv.customer}</p>
            <p>Bắt đầu: {inv.startTime}</p>
            <p>Kết thúc: {inv.endTime}</p>
            <p>Tổng tiền: {inv.cost.toLocaleString()}₫</p>
            <Badge bg={inv.paid ? "success" : "warning"}>
              {inv.paid ? "✅ Đã thanh toán" : "💰 Chưa thanh toán"}
            </Badge>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default InvoiceList;
