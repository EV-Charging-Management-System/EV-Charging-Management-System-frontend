import React from 'react';
import { Card } from 'react-bootstrap';
import type { Station } from './types';

interface StationInfoProps {
  station: Station | null;
  loading: boolean;
}

const StationInfo: React.FC<StationInfoProps> = ({ station, loading }) => {
  if (loading) {
    return <p className="text-center">Loading station information...</p>;
  }

  if (!station) {
    return <p className="text-center text-muted">Station information not found</p>;
  }

  return (
    <Card className="mb-4 shadow-sm ">
      <Card.Body>
        <h2>{station.StationName}</h2>
        <p><b>Address:</b> {station.Address}</p>
        <p><b>Total charging points:</b> {station.ChargingPointTotal}</p>
      </Card.Body>
    </Card>
  );
};

export default StationInfo;
