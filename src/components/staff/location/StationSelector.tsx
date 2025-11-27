import React from 'react';
import { Form, Alert } from 'react-bootstrap';
import type { StaffAddress } from './types';

interface StationSelectorProps {
  stations: StaffAddress[];
  selectedStationId: number | null;
  fetchError: string | null;
  onStationSelect: (stationId: number | null) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  stations,
  selectedStationId,
  fetchError,
  onStationSelect,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '') {
      onStationSelect(null);
      return;
    }
    const stationId = Number(val);
    if (!Number.isNaN(stationId)) {
      onStationSelect(stationId);
    }
  };

  return (
    <div className='location-left-panel center-panel'>
      <h2>Charging Station List - Ho Chi Minh City</h2>
      <Form.Group>
        <Form.Label>Select a station to view on the map:</Form.Label>
        <Form.Select
          value={selectedStationId ?? ''}
          onChange={handleChange}
          size="lg"
        >
          <option value=''>-- Show all stations --</option>
          {stations.map((s) => (
            <option key={s.StationId} value={s.StationId}>
              {s.StationName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="mt-3">
        <small>Total stations managed: {stations.length}</small>
        {fetchError && <Alert variant="danger" className="mt-2">{fetchError}</Alert>}
      </div>
    </div>
  );
};

export default StationSelector;
