import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";

interface Props {
  companyId: number;
}

const SessionHistory: React.FC<Props> = ({ companyId }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        const res = await businessService.getCompanySessions(companyId);
        if (res?.success && Array.isArray(res.data)) {
          setSessions(res.data);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error("❌ Error loading charging history:", err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) return <p>Loading data...</p>;

  if (!sessions.length)
    return <p>⚠️ No charging history found for this company.</p>;

  return (
    <div className="session-history">
      <h3>⚡ Charging History for Company #{companyId}</h3>

      <table className="session-table">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>License Plate</th>
            <th>Vehicle Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration (minutes)</th>
            <th>Status</th>
            <th>Total Cost (VND)</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s) => (
            <tr key={s.SessionId}>
              <td>{s.SessionId}</td>
              <td>{s.LicensePlate}</td>
              <td>{s.VehicleName}</td>
              <td>{new Date(s.CheckinTime).toLocaleString("en-US")}</td>
              <td>{new Date(s.CheckoutTime).toLocaleString("en-US")}</td>
              <td>{s.TotalTime}</td>
              <td>{s.ChargingStatus}</td>
              <td>{s.SessionPrice?.toLocaleString("en-US") ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistory;
