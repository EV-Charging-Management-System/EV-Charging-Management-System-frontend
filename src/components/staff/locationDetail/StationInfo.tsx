import React from 'react';
import { Card } from 'react-bootstrap';
import type { Station } from './types';

interface StationInfoProps {
  station: Station | null;
  loading: boolean;
}

const StationInfo: React.FC<StationInfoProps> = ({ station, loading }) => {
  if (loading) {
    return <p className="text-center">Đang tải thông tin trạm...</p>;
  }

  if (!station) {
    return <p className="text-center text-muted">Không tìm thấy thông tin trạm</p>;
  }

  return (
    <Card className="mb-4 shadow-sm ">
      <Card.Body>
        <h2>{station.StationName}</h2>
        <p><b>Địa chỉ:</b> {station.Address}</p>
        <p><b>Tổng số trụ:</b> {station.ChargingPointTotal}</p>
      </Card.Body>
    </Card>
  );
};

export default StationInfo;
