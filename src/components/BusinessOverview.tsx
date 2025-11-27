import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";

interface Props {
  companyId: number;
}

const BusinessOverview: React.FC<Props> = ({ companyId }) => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      try {
        const res = await businessService.getCompanyOverview(companyId);
        if (res.success) setOverview(res.data);
      } catch (err) {
        console.error("❌ Error loading business overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  if (loading) return <p>Loading...</p>;
  if (!overview) return <p>No overview data available.</p>;

  return (
    <div className="overview-container">
      <h3>📈 Business Overview Report</h3>

      <div className="overview-grid">

        <div className="overview-card">
          <h3>Total Charging Sessions</h3>
          <p>{overview.totalSessions}</p>
        </div>

        <div className="overview-card">
          <h3>Total Vehicles</h3>
          <p>{overview.totalVehicles}</p>
        </div>

        <div className="overview-card">
          <h3>Active Subscriptions</h3>
          <p>{overview.subscriptionCount}</p>
        </div>

      </div>

      <h4 style={{ marginTop: "25px", color: "#00ffa3" }}>
        🏆 Top Active Users
      </h4>

      <table className="session-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Charging Sessions</th>
            <th>Total Spending (VND)</th>
          </tr>
        </thead>
        <tbody>
          {overview.topUsers?.map((u: any, i: number) => (
            <tr key={i}>
              <td>{u.userId}</td>
              <td>{u.name}</td>
              <td>{u.sessions}</td>
              <td>{u.totalSpent?.toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessOverview;
