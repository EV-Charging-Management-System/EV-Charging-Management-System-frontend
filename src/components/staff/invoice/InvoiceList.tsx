import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import type { InvoiceData } from './types';

interface InvoiceListProps {
  invoices: InvoiceData[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  if (invoices.length === 0) {
    return <p className="text-center text-muted">No invoices available.</p>;
  }

  return (
    <div>
      <h2 className="mb-3">Invoice History</h2>
      {invoices.map(inv => (
        <Card key={inv.sessionId} className="invoice-box shadow-sm mb-3">
          <Card.Body>
            <p><strong>Invoice #{inv.sessionId}</strong></p>
            <p>Station: {inv.stationName}</p>
            <p>Charger: {inv.chargerName} ({inv.power})</p>
            <p>Customer: {inv.customer}</p>
            <p>Start: {inv.startTime}</p>
            <p>End: {inv.endTime}</p>
            <p>Total: {inv.cost.toLocaleString()}₫</p>
            <Badge bg={inv.paid ? "success" : "warning"}>
              {inv.paid ? "✅ Paid" : "💰 Unpaid"}
            </Badge>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default InvoiceList;
