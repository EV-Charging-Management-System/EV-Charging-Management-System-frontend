import React from "react";
import "../css/AdminDashboard.css";

interface StaffTableProps {
  staffList: any[];
  loading: boolean;
}

const StaffTable: React.FC<StaffTableProps> = ({ staffList, loading }) => {
  return (
    <div className="staff-table-container">
      <h2>👥 Danh sách nhân viên (Staff)</h2>

      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : staffList.length === 0 ? (
        <p>Chưa có nhân viên nào.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên nhân viên</th>
              <th>Email</th>
              <th>Vai trò</th>
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
