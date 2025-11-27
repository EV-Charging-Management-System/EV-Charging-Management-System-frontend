import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
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
        <Row className="align-items-center">
          <Col md={3}>
            <h5>{session.StationName}</h5>
            <p className="mb-1"><FaMapMarkerAlt /> {session.address}</p>
          </Col>
          <Col md={3}>
            <p className="mb-1"><FaBolt /> {session.chargerName} ({session.power})</p>
            {session.userType === "guest" && (
              <p className="mb-1">Pin: {session.batteryPercentage}%</p>
            )}
          </Col>
          <Col md={2}>
            {session.UserId && <p className="mb-1">UserId: {session.UserId}</p>}
            <p className="mb-1">Loại: {session.userType === "guest" ? "Khách" : "Tài khoản"}</p>
            <p className="mb-1">Giá: {session.portPrice?.toLocaleString()} ₫/kWh</p>
          </Col>
          <Col md={2}>
            <p className="mb-1"><FaCalendarAlt /> {session.date}</p>
            <p className="mb-1"><FaClock /> {session.time}</p>
            <p className="mb-1"><FaHashtag /> #{session.SessionId}</p>
          </Col>
          <Col md={2} className="text-end d-flex align-items-start justify-content-end">
            <Button 
              variant="success" 
              className="start-btn" 
              onClick={() => onStartCharging(session)}
            >
              Bắt đầu sạc
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SessionCard;
