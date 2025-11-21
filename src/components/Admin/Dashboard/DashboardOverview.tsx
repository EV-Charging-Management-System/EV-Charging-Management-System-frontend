import {
  Users, UserPlus, Building2,
  BatteryCharging, CalendarCheck2, DollarSign,
} from "lucide-react";

const DashboardOverview = ({ stats }: any) => {
  // fallback an toàn
  const safe = (value: any) => value ?? 0;

  return (
    <section className="dashboard-section">
      <h2>Tổng quan hệ thống</h2>

      <div className="dashboard-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="card"><Users size={32} /><h3>{safe(stats?.totalUsers)}</h3><p>Người dùng</p></div>

        <div className="card"><UserPlus size={32} /><h3>{safe(stats?.totalStaff)}</h3><p>Nhân viên</p></div>

        <div className="card"><Building2 size={32} /><h3>{safe(stats?.totalBusiness)}</h3><p>Tài khoản DN</p></div>

        <div className="card"><BatteryCharging size={32} /><h3>{safe(stats?.totalStations)}</h3><p>Trạm sạc</p></div>

        <div className="card"><CalendarCheck2 size={32} /><h3>{safe(stats?.totalSessions)}</h3><p>Lịch đặt</p></div>

        <div className="card highlight">
          <DollarSign size={32} />
          <h3>
            {safe(stats?.totalRevenue).toLocaleString("vi-VN")} ₫
          </h3>
          <p>Doanh thu</p>
        </div>

      </div>
    </section>
  );
};

export default DashboardOverview;
