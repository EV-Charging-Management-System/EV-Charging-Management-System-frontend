import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaBolt, FaCalendarAlt, FaClock, FaHashtag } from 'react-icons/fa';
import type { Session } from './types';

interface SessionCardProps {
  session: Session;
  onStartCharging: (session: Session) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onStartCharging }) => {
  return (
    <Card className="waiting-card mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h3>{session.StationName}</h3>
            <p><FaMapMarkerAlt /> {session.address}</p>
            <p><FaBolt /> {session.chargerName} ({session.power})</p>
            <p>
              {session.userType === "guest" 
                ? `Pin: ${session.batteryPercentage}%` 
                : `Biển số: ${session.LicensePlate}`}
            </p>
            {session.UserId && <p>UserId: {session.UserId}</p>}
            <p>Loại: {session.userType === "guest" ? "Khách vãng lai" : "Có tài khoản"}</p>
            <p>Giá: {session.portPrice?.toLocaleString()} ₫/kWh</p>
          </div>
          <div>
            <p><FaCalendarAlt /> {session.date}</p>
            <p><FaClock /> {session.time}</p>
            <p><FaHashtag /> #{session.SessionId}</p>
          </div>
        </div>
        <div className="form-buttons mt-3">
          <Button 
            variant="success" 
            className="start-btn" 
            onClick={() => onStartCharging(session)}
          >
            Bắt đầu sạc
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SessionCard;
