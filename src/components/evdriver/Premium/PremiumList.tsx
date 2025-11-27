import React from "react";
import PremiumCard from "./PremiumCard";
import BusinessCard from "./BusinessCard";

const PremiumList = ({ premium1, premium3, premium6, premium12, business }) => {
  return (
    <>
      <h2 style={{ marginTop: 30 }}>Premium Packages</h2>

      <div className="premium-plan-container">

        {premium1 && (
          <PremiumCard
            title="Premium 1 Month"
            price={premium1.PackagePrice}
            packageId={premium1.PackageId}
            benefits={[
              "⚡ Access to EV station network",
              "⭐ 24/7 priority support",
              "🚗 Early notifications",
              "🎁 Voucher 10,000đ"
            ]}
          />
        )}

        {premium3 && (
          <PremiumCard
            title="Premium 3 Months"
            price={premium3.PackagePrice}
            packageId={premium3.PackageId}
            benefits={[
              "⚡ All Premium benefits",
              "🎁 Extra 5% discount",
              "💡 Early renewal reminder"
            ]}
          />
        )}

        {premium6 && (
          <PremiumCard
            title="Premium 6 Months"
            price={premium6.PackagePrice}
            packageId={premium6.PackageId}
            benefits={[
              "⚡ Full Premium benefits",
              "🎁 50,000đ voucher",
              "💰 Save over 10%"
            ]}
          />
        )}

        {premium12 && (
          <PremiumCard
            title="Premium 12 Months"
            price={premium12.PackagePrice}
            packageId={premium12.PackageId}
            benefits={[
              "⚡ Maximum Premium features",
              "💎 Extra 10% renewal discount",
              "🎉 Birthday gift included"
            ]}
          />
        )}
      </div>

      <h2 style={{ marginTop: 50 }}>Business Package</h2>

      {business && (
        <BusinessCard
          benefits={[
            "🏢 Manage multiple vehicles",
            "📊 Revenue reports",
            "💼 Cycle-based billing",
            "🔒 Priority technical support"
          ]}
        />
      )}

      <p className="note">*Select a package to view detailed benefits.</p>
    </>
  );
};

export default PremiumList;
