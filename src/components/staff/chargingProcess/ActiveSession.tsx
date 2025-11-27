import React from 'react';
import { FaMapMarkerAlt, FaBolt, FaClock, FaBatteryFull } from 'react-icons/fa';
import type { Session } from './types';

interface ActiveSessionProps {
  session: Session;
  battery: number;
  elapsedSeconds: number;
  cost: number;
  startTime: Date | null;
  onEndCharging: () => void;
}

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const ActiveSession: React.FC<ActiveSessionProps> = ({
  session,
  battery,
  elapsedSeconds,
  cost,
  startTime,
  onEndCharging,
}) => {
  return (
    <div className="charging-session-container">
      {/* Progress Bar */}
      <div className="charge-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${battery}%` }}></div>
        </div>
      </div>

      {/* Battery Percentage - Large Display */}
      <div className="progress-bar-large">
        <div className="progress-fill-large" style={{ width: `${battery}%` }}>
          {battery.toFixed(0)}%
        </div>
      </div>

      {/* Stop Button */}
      <div className="charging-buttons" style={{ margin: '24px 0' }}>
        <button className="charging-btn" onClick={onEndCharging}>
          ⚡ Stop Charging
        </button>
      </div>

      {/* Session Info Grid */}
      <div className="session-info">
        <div className="info-box">
          <h3><FaBatteryFull style={{ marginRight: '8px' }} />Charging Info</h3>
          <p>Current battery level: <strong>{battery.toFixed(0)}%</strong></p>
          <p>Energy consumed: <strong>0.00 kWh</strong></p>
          <p>Power: <strong>{session.power}</strong></p>
        </div>

        <div className="info-box">
          <h3><FaClock style={{ marginRight: '8px' }} />Time & Cost</h3>
          <p>Charging time: <strong>{formatDuration(elapsedSeconds)}</strong></p>
          <p>Cost: <strong>{cost.toFixed(0)} ₫</strong></p>
        </div>
      </div>
    </div>
  );
};

export default ActiveSession;
