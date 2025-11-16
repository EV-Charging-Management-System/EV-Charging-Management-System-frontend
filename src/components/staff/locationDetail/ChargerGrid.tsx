import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import type { ChargingPoint } from './types';

interface ChargerGridProps {
  chargers: ChargingPoint[];
  loading: boolean;
  onOpenForm: (charger: ChargingPoint) => void;
}

const renderStatus = (s?: string) =>
  s === "AVAILABLE" ? "Còn trống" : s === "BUSY" ? "Đang sạc" : "Bảo trì";

const getStatusVariant = (s?: string) => {
  if (s === "AVAILABLE") return "success";
  if (s === "BUSY") return "danger";
  return "secondary";
};

const ChargerGrid: React.FC<ChargerGridProps> = ({ chargers, loading, onOpenForm }) => {
  if (loading) {
    return <p className="text-center">Đang tải danh sách điểm sạc...</p>;
  }

  if (chargers.length === 0) {
    return <p className="text-center text-muted">Chưa có điểm sạc nào</p>;
  }

  return (
    <div className="charger-grid">
      {chargers.map(ch => (
        <Card
          key={ch.PointId}
          className={`charger-card ${ch.ChargingPointStatus?.toLowerCase()}`}
          onClick={() => onOpenForm(ch)}
          style={{ cursor: 'pointer' }}
        >
          <Card.Body className="text-center">
            <h3>Điểm #{ch.PointId}</h3>
            <Badge bg={getStatusVariant(ch.ChargingPointStatus)}>
              {renderStatus(ch.ChargingPointStatus)}
            </Badge>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ChargerGrid;
