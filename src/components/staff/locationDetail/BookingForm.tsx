import React from 'react';
import { Modal, Form, Button, Badge, Row, Col } from 'react-bootstrap';
import type { BookingFormData, ChargingPort } from './types';

interface BookingFormProps {
  show: boolean;
  userType: "EV-Driver" | "Guest";
  form: BookingFormData;
  ports: ChargingPort[];
  loadingPorts: boolean;
  loadingSubmit: boolean;
  onClose: () => void;
  onUserTypeChange: (type: "EV-Driver" | "Guest") => void;
  onLicenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLookup: () => void;
  onPortSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  show,
  userType,
  form,
  ports,
  loadingPorts,
  loadingSubmit,
  onClose,
  onUserTypeChange,
  onLicenseChange,
  onLookup,
  onPortSelect,
  onSubmit,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>⚡ Book Charging Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          {/* User Type */}
          <Form.Group className="mb-3">
            <Form.Label>User Type</Form.Label>
            <Form.Select
              value={userType}
              onChange={(e) => onUserTypeChange(e.target.value as "EV-Driver" | "Guest")}
            >
              <option value="EV-Driver">🚗 Registered User (EV-Driver)</option>
              <option value="Guest">👤 Guest</option>
            </Form.Select>
          </Form.Group>

          {/* License Plate */}
          {userType === "EV-Driver" && (
            <Form.Group className="mb-3">
              <Form.Label>License Plate</Form.Label>
              <Row>
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="Enter license plate (e.g.: 51A-12345)"
                    value={form.licensePlate}
                    onChange={onLicenseChange}
                    required
                  />
                </Col>
                <Col xs={4}>
                  <Button variant="info" onClick={onLookup} className="w-100">
                    🔍 Lookup
                  </Button>
                </Col>
              </Row>

              {form.displayName && (
                <Badge bg="success" className="mt-2">
                  ✅ {form.displayName}
                </Badge>
              )}
            </Form.Group>
          )}

          {/* Charging Port */}
          <Form.Group className="mb-3">
            <Form.Label>Select Charging Port</Form.Label>
            <Form.Select
              value={form.portId}
              onChange={onPortSelect}
              required
              disabled={loadingPorts}
            >
              <option value="">-- Select charging port --</option>
              {ports.map(p => (
                <option key={p.PortId} value={p.PortId}>
                  {p.PortType} - {p.PortTypeOfKwh} kWh
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Port Info */}
          {form.portId && (
            <div className="mb-3 p-3 bg-light rounded">
              <Row>
                <Col>
                  <span>⚡ Power:</span>
                  <strong className="ms-2">{form.kwh} kWh</strong>
                </Col>
                <Col>
                  <span>💰 Price:</span>
                  <strong className="ms-2">{Number(form.price).toLocaleString()} ₫/kWh</strong>
                </Col>
              </Row>
            </div>
          )}

          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="success"
              disabled={loadingSubmit}
              className="flex-grow-1"
            >
              {loadingSubmit ? "⏳ Processing..." : "✅ Confirm"}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              ❌ Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingForm;
