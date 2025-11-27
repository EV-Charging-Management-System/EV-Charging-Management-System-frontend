import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import type { ChargingPoint } from './types';

interface ChargerGridProps {
  chargers: ChargingPoint[];
  loading: boolean;
  onOpenForm: (charger: ChargingPoint) => void;
}

const renderStatus = (s?: string) =>
  s === "AVAILABLE" ? "Available" : s === "BUSY" ? "Charging" : "Maintenance";

const getStatusVariant = (s?: string) => {
  if (s === "AVAILABLE") return "success";
  if (s === "BUSY") return "danger";
  return "secondary";
};

const ChargerGrid: React.FC<ChargerGridProps> = ({ chargers, loading, onOpenForm }) => {
  if (loading) {
    return <p className="text-center">Loading charging points...</p>;
  }

  if (chargers.length === 0) {
    return <p className="text-center text-muted">No charging points available</p>;
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
            <h3>Point #{ch.PointId}</h3>
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
