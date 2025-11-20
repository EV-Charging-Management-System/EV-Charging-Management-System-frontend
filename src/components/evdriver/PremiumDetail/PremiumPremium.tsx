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

  // 🔥 FIX CHÍNH: FETCH subscription MỖI LẦN TRUY CẬP TRANG GÓI
  useEffect(() => {
    premiumService.getCurrentSubscription().then((res) => {
      if (res?.success) setMembership(res.data);
    });
  }, [premiumId]);

  const hasPremium = membership?.SubStatus === "ACTIVE";
  const isCurrentPackage = membership?.PackageId === premiumId;

  // ================= RENDER LOGIC ====================
  if (hasPremium && isCurrentPackage) {
    return (
      <>
        <h3>✅ Bạn đã mua gói này</h3>
        <p>
          Hiệu lực:{" "}
          {new Date(membership.StartDate).toLocaleDateString()} →{" "}
          {new Date(membership.ExpireDate).toLocaleDateString()}
        </p>
        <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
          ← Quay lại
        </button>
      </>
    );
  }

  if (hasPremium && !isCurrentPackage) {
    return (
      <>
        <h3>⚠ Bạn đang sử dụng một gói Premium khác</h3>
        <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
          ← Quay lại
        </button>
      </>
    );
  }

  // ================= NẾU CHƯA PREMIUM ====================
  const handlePay = async () => {
    const payload = {
      PackageId: premiumId,
      StartDate: new Date().toISOString().split("T")[0],
      DurationMonth: "3"
    };

    const res = await premiumService.createSubscription(payload);

    if (res?.vnpUrl) {
      window.location.href = res.vnpUrl.replace(/&amp;/g, "&");
    }
  };

  return (
    <>
      <button className="confirm-btn" onClick={handlePay}>
        Xác nhận & Thanh toán
      </button>

      <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
        ← Quay lại
      </button>
    </>
  );
};

export default PremiumPremium;
