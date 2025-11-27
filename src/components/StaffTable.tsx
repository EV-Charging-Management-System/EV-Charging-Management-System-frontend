import React from "react";
import "../css/AdminDashboard.css";

interface StaffTableProps {
  staffList: any[];
  loading: boolean;
}

const StaffTable: React.FC<StaffTableProps> = ({ staffList, loading }) => {
  return (
    <div className="staff-table-container">
      <h2>👥 Staff List</h2>

      {loading ? (
        <p>⏳ Loading...</p>
      ) : staffList.length === 0 ? (
        <p>No staff members found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s) => (
              <tr key={s.UserId}>
                <td>{s.UserId}</td>
                <td>{s.UserName}</td>
                <td>{s.Mail}</td>
                <td>{s.RoleName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffTable;
