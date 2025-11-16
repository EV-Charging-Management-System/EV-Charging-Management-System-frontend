import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import type { InvoiceData } from './types';

interface InvoiceDetailProps {
  invoice: InvoiceData;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice }) => {
  return (
    <Card className="invoice-box shadow-sm mb-4">
      <Card.Body>
        <Card.Title className="mb-3">
          <h2>Hóa đơn phiên sạc #{invoice.sessionId}</h2>
        </Card.Title>

        {invoice.invoiceId && (
          <p><strong>🧾 Mã hóa đơn:</strong> #{invoice.invoiceId}</p>
        )}
        <p><strong>📱 Phiên sạc:</strong> #{invoice.sessionId}</p>
        
        {invoice.stationName && (
          <p><strong>📍 Trạm:</strong> {invoice.stationName}</p>
        )}
        
        {invoice.chargerName && (
          <p>
            <strong>⚡ Cổng sạc:</strong> {invoice.chargerName} 
            {invoice.power && ` (${invoice.power})`}
          </p>
        )}
        
        {invoice.customer && (
          <p><strong>🚗 Xe/Khách hàng:</strong> {invoice.customer}</p>
        )}
        
        {invoice.startTime && (
          <p><strong>🕐 Bắt đầu:</strong> {invoice.startTime}</p>
        )}
        
        {invoice.endTime && (
          <p><strong>🕐 Kết thúc:</strong> {invoice.endTime}</p>
        )}
        
        {invoice.createdAt && (
          <p>
            <strong>📅 Ngày tạo HĐ:</strong>{' '}
            {new Date(invoice.createdAt).toLocaleString("vi-VN")}
          </p>
        )}
        
        <hr className="my-3" style={{ borderTop: "1px dashed rgba(124, 255, 178, 0.3)" }} />
        
        {invoice.sessionPrice !== undefined && (
          <p style={{ fontSize: "1.1em" }}>
            <strong>💰 Chi phí sạc:</strong> 
            <span className="text-success fw-bold ms-2">
              {invoice.sessionPrice.toLocaleString()} ₫
            </span>
          </p>
        )}
        
        {invoice.penaltyFee !== undefined && invoice.penaltyFee > 0 && (
          <p style={{ fontSize: "1.1em" }}>
            <strong>⚠️ Phí phạt:</strong> 
            <span className="text-warning fw-bold ms-2">
              {invoice.penaltyFee.toLocaleString()} ₫
            </span>
          </p>
        )}
        
        {(invoice.totalAmount !== undefined || invoice.cost !== undefined) && (
          <p style={{ 
            fontSize: "1.3em", 
            marginTop: "12px", 
            paddingTop: "12px", 
            borderTop: "1px solid rgba(124, 255, 178, 0.5)" 
          }}>
            <strong>💵 TỔNG CỘNG:</strong> 
            <span className="text-success fw-bold fs-4 ms-2">
              {(invoice.totalAmount ?? invoice.cost ?? 0).toLocaleString()} ₫
            </span>
          </p>
        )}
        
        <hr className="my-3" style={{ borderTop: "1px dashed rgba(124, 255, 178, 0.3)" }} />
        
        {invoice.PaidStatus && (
          <p>
            <strong>📊 Trạng thái:</strong>{' '}
            <Badge 
              bg={invoice.PaidStatus.toUpperCase() === "PAID" ? "success" : "warning"}
              className="ms-2"
            >
              {invoice.PaidStatus.toUpperCase() === "PAID" ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}
            </Badge>
          </p>
        )}
      </Card.Body>
    </Card>
  );
};

export default InvoiceDetail;
