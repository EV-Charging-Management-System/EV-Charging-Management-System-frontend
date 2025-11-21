import React from "react";
import PremiumCard from "./PremiumCard";
import BusinessCard from "./BusinessCard";

const PremiumList = ({ premium1, premium3, premium6, premium12, business }) => {
  return (
    <>
      <h2 style={{ marginTop: 30 }}>Các Gói Premium</h2>

      <div className="premium-plan-container">

        {premium1 && (
          <PremiumCard
            title="Premium 1 tháng"
            price={premium1.PackagePrice}
            packageId={premium1.PackageId}
            benefits={[
              "⚡ Truy cập hệ thống trạm sạc",
              "⭐ Hỗ trợ ưu tiên 24/7",
              "🚗 Nhận thông báo sớm",
              "🎁 Voucher 10.000đ"
            ]}
          />
        )}

        {premium3 && (
          <PremiumCard
            title="Premium 3 tháng"
            price={premium3.PackagePrice}
            packageId={premium3.PackageId}
            benefits={[
              "⚡ Toàn bộ quyền lợi Premium",
              "🎁 Tặng thêm 5% ưu đãi",
              "💡 Nhắc nhở gia hạn sớm"
            ]}
          />
        )}

        {premium6 && (
          <PremiumCard
            title="Premium 6 tháng"
            price={premium6.PackagePrice}
            packageId={premium6.PackageId}
            benefits={[
              "⚡ Quyền lợi đầy đủ",
              "🎁 Tặng voucher 50.000đ",
              "💰 Tiết kiệm hơn 10%"
            ]}
          />
        )}

        {premium12 && (
          <PremiumCard
            title="Premium 12 tháng"
            price={premium12.PackagePrice}
            packageId={premium12.PackageId}
            benefits={[
              "⚡ Quyền lợi đầy đủ nhất",
              "💎 Giảm thêm 10% khi gia hạn",
              "🎉 Có quà tặng sinh nhật"
            ]}
          />
        )}
      </div>

      <h2 style={{ marginTop: 50 }}>Gói Business</h2>

      {business && (
        <BusinessCard
          benefits={[
            "🏢 Quản lý nhiều phương tiện",
            "📊 Báo cáo doanh thu",
            "💼 Thanh toán theo chu kỳ",
            "🔒 Hỗ trợ kỹ thuật ưu tiên"
          ]}
        />
      )}

      <p className="note">*Chọn gói để xem quyền lợi chi tiết.</p>
    </>
  );
};

export default PremiumList;
