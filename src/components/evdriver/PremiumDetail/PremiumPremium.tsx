import React, { useEffect, useState } from "react";
import { premiumService } from "../../../services/premiumService";
import { authService } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const PremiumPremium = () => {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const premiumId = Number(params.get("id"));

  const [user, setUser] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);

  useEffect(() => {
    authService.getProfile().then((u) => setUser(u));
  }, []);

  useEffect(() => {
    premiumService.getCurrentSubscription().then((res) => {
      if (res?.success) setMembership(res.data);
    });
  }, [premiumId]);

  const hasPremium = membership?.SubStatus === "ACTIVE";
  const isCurrentPackage = membership?.PackageId === premiumId;

  // ===== QUY ĐỊNH NỘI DUNG CHI TIẾT THEO GÓI =====
  const packageInfo: any = {
    2: {
      title: "Premium 1 Month",
      price: "299,000 VND",
      benefits: [
        "⚡ Access to Premium charging network",
        "⭐ 24/7 priority support",
        "🚘 Early notifications",
        "🎟️ Voucher 10,000đ",
      ],
    },
    3: {
      title: "Premium 3 Months",
      price: "749,000 VND",
      benefits: [
        "⚡ Full Premium benefits",
        "🎁 Extra 5% reward discount",
        "🔔 Early renewal reminders",
        "🚘 24/7 priority support",
        "🎟️ Voucher 20,000đ",
      ],
    },
    4: {
      title: "Premium 6 Months",
      price: "1,399,000 VND",
      benefits: [
        "⚡ Full benefits",
        "🎁 Free 50,000đ voucher",
        "💰 Save over 10%",
        "🚘 Priority support 24/7",
      ],
    },
    5: {
      title: "Premium 12 Months",
      price: "2,599,000 VND",
      benefits: [
        "⚡ Most complete Premium benefits",
        "💎 Additional 10% renewal discount",
        "🎉 Birthday gift included",
        "🎟️ Voucher 100,000đ",
        "🚘 24/7 support",
      ],
    },
  };

  const pkg = packageInfo[premiumId] || null;

  // ========== IF USER ALREADY OWNS THIS PACKAGE ==========
  if (hasPremium && isCurrentPackage) {
    return (
      <div className="premium-modal">
        <h3>✅ You already own this package</h3>
        <p>
          Valid from: {new Date(membership.StartDate).toLocaleDateString()} →{" "}
          {new Date(membership.ExpireDate).toLocaleDateString()}
        </p>

        <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
          ← Back
        </button>
      </div>
    );
  }

  // =========== IF USER OWNS A DIFFERENT PACKAGE ============
  if (hasPremium && !isCurrentPackage) {
    return (
      <div className="premium-modal">
        <h3>⚠ You are currently using another Premium package</h3>
        <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
          ← Back
        </button>
      </div>
    );
  }

  // ========== IF USER HAS NOT PURCHASED PREMIUM ==========
  const handlePay = async () => {
    const payload = {
      PackageId: premiumId,
      StartDate: new Date().toISOString().split("T")[0],
      DurationMonth: premiumId.toString(),
    };

    const res = await premiumService.createSubscription(payload);
    if (res?.vnpUrl) {
      window.location.href = res.vnpUrl.replace(/&amp;/g, "&");
    }
  };

  return (
    <div className="premium-modal">
      <h2 className="modal-title">You selected: {pkg?.title}</h2>

      <div className="modal-box">
        <p className="modal-price">💵 Price: {pkg?.price}</p>

        <p className="modal-benefit-title">🎁 Package Benefits:</p>
        <ul className="modal-benefit-list">
          {pkg?.benefits?.map((b: string, i: number) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      <button className="confirm-btn" onClick={handlePay}>
        Confirm & Pay
      </button>

      <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
        ← Back
      </button>
    </div>
  );
};

export default PremiumPremium;
