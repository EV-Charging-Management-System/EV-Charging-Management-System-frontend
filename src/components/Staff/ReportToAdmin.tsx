import React from "react";
import { useNavigate } from "react-router-dom";
import ".../../css/Location.css";
import ProfileStaff from "../../Customhooks/ProfileStaff";
import StaffSideBar from "../../components/layouts/staffSidebar";

const ReportToAdmin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="staff-wrapper">
      <StaffSideBar />

      {/* Header giữ nguyên */}
      <main className="staff-main">
        <header className="staff-header">
          <h1>📍 Manage Locations</h1>
          <div className="staff-header-actions">
            <ProfileStaff />
          </div>
        </header>

        {/* Content riêng của trang */}
        <section className="staff-content">
          <p>This is Location Page. Content will be added later.</p>
        </section>
      </main>
    </div>
  );
};

export default ReportToAdmin;
