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
 // ===== QUY ĐỊNH NỘI DUNG CHI TIẾT THEO GÓI =====
const packageInfo: any = {
  2: {
    title: "Premium 1 tháng",
    price: "299,000 VND",
    benefits: [
      "⚡ Truy cập hệ thống trạm sạc Premium",
      "⭐ Hỗ trợ ưu tiên 24/7",
      "🚘 Nhận thông báo sớm",
      "🎟️ Voucher 10.000đ",
    ],
  },
  3: {
    title: "Premium 3 tháng",
    price: "749,000 VND",
    benefits: [
      "⚡ Full Premium benefits",
      "🎁 Thưởng thêm 5% ưu đãi",
      "🔔 Nhắc nhở gia hạn sớm",
      "🚘 Ưu tiên hỗ trợ 24/7",
      "🎟️ Voucher 20.000đ",
    ],
  },
  4: {
    title: "Premium 6 tháng",
    price: "1,399,000 VND",
    benefits: [
      "⚡ Quyền lợi đầy đủ",
      "🎁 Tặng voucher 50.000đ",
      "💰 Tiết kiệm hơn 10%",
      "🚘 Hỗ trợ ưu tiên 24/7",
    ],
  },
  5: {
    title: "Premium 12 tháng",
    price: "2,599,000 VND",
    benefits: [
      "⚡ Quyền lợi đầy đủ nhất",
      "💎 Giảm thêm 10% khi gia hạn",
      "🎉 Có quà tặng sinh nhật",
      "🎟️ Voucher 100.000đ",
      "🚘 Hỗ trợ 24/7",
    ],
  },
};


  const pkg = packageInfo[premiumId] || null;

  // ========== NẾU ĐÃ MUA GÓI HIỆN TẠI ==========
  if (hasPremium && isCurrentPackage) {
    return (
      <div className="premium-modal">
        <h3>✅ Bạn đã mua gói này</h3>
        <p>
          Hiệu lực: {new Date(membership.StartDate).toLocaleDateString()} →{" "}
          {new Date(membership.ExpireDate).toLocaleDateString()}
        </p>

        <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
          ← Quay lại
        </button>
      </div>
    );
  }

  // =========== NẾU ĐANG DÙNG GÓI KHÁC ============
  if (hasPremium && !isCurrentPackage) {
    return (
      <div className="premium-modal">
        <h3>⚠ Bạn đang sử dụng một gói Premium khác</h3>
        <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
          ← Quay lại
        </button>
      </div>
    );
  }

  // ========== NẾU CHƯA MUA PREMIUM ==========
  const handlePay = async () => {
    const payload = {
      PackageId: premiumId,
      StartDate: new Date().toISOString().split("T")[0],
      DurationMonth: premiumId.toString(), // Giống gói
    };

    const res = await premiumService.createSubscription(payload);
    if (res?.vnpUrl) {
      window.location.href = res.vnpUrl.replace(/&amp;/g, "&");
    }
  };

  return (
    <div className="premium-modal">
      <h2 className="modal-title">Bạn đã chọn: {pkg?.title}</h2>

      <div className="modal-box">
        <p className="modal-price">💵 Giá: {pkg?.price}</p>

        <p className="modal-benefit-title">🎁 Quyền lợi gói này:</p>
        <ul className="modal-benefit-list">
          {pkg?.benefits?.map((b: string, i: number) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      <button className="confirm-btn" onClick={handlePay}>
        Xác nhận & Thanh toán
      </button>

      <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
        ← Quay lại
      </button>
    </div>
  );
};

export default PremiumPremium;
