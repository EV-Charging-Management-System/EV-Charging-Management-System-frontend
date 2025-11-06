import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/PremiumDetail.css";
import { premiumService } from "../../services/premiumService";
import { authService } from "../../services/authService";
import { businessService } from "../../services/businessService";

const PremiumDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [membership, setMembership] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // ✅ Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await authService.getProfile({ noCache: true });
        console.log("[PremiumDetail] 👤 User profile:", u);
        setUser(u);

        const role = (u?.roleName || u?.role || "").toUpperCase();
        setIsPremium(u?.isPremium === true || role === "PREMIUM");
        setIsBusiness(role === "BUSINESS");
      } catch (err) {
        console.warn("⚠️ Không thể lấy thông tin người dùng:", err);
      }
    };
    fetchUser();
  }, []);

  // 🟢 ✅ Thêm mới: Kiểm tra gói Premium hiện tại khi mở trang
  useEffect(() => {
    const checkCurrentSubscription = async () => {
      try {
        const res = await premiumService.getCurrentSubscription();
        console.log("[premiumService] ✅ Current subscription:", res);
        if (res?.success && res?.data) {
          const sub = res.data;
          if (sub.SubStatus === "ACTIVE") {
            setIsPremium(true);
            setMembership(sub);
            console.log("🔁 Đã có gói Premium đang hoạt động:", sub);
          }
        }
      } catch (err) {
        console.warn("⚠️ Không thể kiểm tra gói Premium:", err);
      }
    };
    checkCurrentSubscription();
  }, []);

  // ✅ Khi quay lại sau thanh toán VNPay
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const txnRef = params.get("txnRef");

    if (code === "00" && txnRef?.startsWith("SUB_")) {
      console.log(`[PremiumDetail] 🧾 Thanh toán Premium thành công (txnRef=${txnRef})`);

      const refreshAfterPayment = async () => {
        try {
          // ✅ Gọi đúng endpoint /subscription/current
          const res = await premiumService.getCurrentSubscription();
          if (res.success && res.data) {
            setIsPremium(true);
            setMembership(res.data);
            console.log("🎉 Premium activated:", res.data);
          } else {
            console.warn("⚠️ Không lấy được gói sau thanh toán:", res);
          }
        } catch (err) {
          console.error("❌ Lỗi khi cập nhật Premium sau thanh toán:", err);
        }
      };
      refreshAfterPayment();
    }
  }, []);

  // ✅ Load thông tin gói Premium nếu đang là hội viên
  useEffect(() => {
    if (!isPremium) return;
    const fetchSubscription = async () => {
      try {
        const res = await premiumService.getCurrentSubscription();
        if (res?.data) setMembership(res.data);
      } catch (err) {
        console.warn("⚠️ Không thể lấy thông tin gói Premium:", err);
      }
    };
    fetchSubscription();
  }, [isPremium]);

  // ✅ Danh sách gói
  const packages = {
    "plan-premium": {
      id: 1,
      title: "Gói Premium",
      desc: "Trải nghiệm đặc quyền cao cấp – truy cập không giới hạn và hỗ trợ ưu tiên.",
      benefits: [
        "⚡ Truy cập toàn bộ hệ thống trạm sạc trên toàn quốc.",
        "💬 Hỗ trợ 24/7 riêng cho hội viên Premium.",
        "📢 Nhận thông báo sớm về trạm sạc trống & khuyến mãi độc quyền.",
        "🗺️ Tự động lưu lịch sử giao dịch và trạm yêu thích.",
        "🎁 Ưu đãi thành viên với đối tác liên kết.",
      ],
      paymentType: "VNPay",
    },
    "plan-business": {
      id: 2,
      title: "Tài Khoản Doanh Nghiệp",
      desc: "Quản lý nhiều phương tiện, nhân viên và thanh toán định kỳ qua Ví Trả Sau.",
      benefits: [
        "📊 Theo dõi hiệu suất sạc theo thời gian thực.",
        "📋 Báo cáo doanh thu và giao dịch định kỳ.",
        "💼 Quản lý nhiều phương tiện & tài khoản nhân viên.",
        "💰 Thanh toán tập trung qua Ví Trả Sau.",
        "🧰 Ưu tiên hỗ trợ kỹ thuật & bảo mật nâng cao.",
      ],
      paymentType: "Wallet",
    },
  };

  const current = packages[type as keyof typeof packages];
  if (!current) {
    return (
      <div className="detail-container">
        <div className="detail-card fade-in">
          <h2>Không tìm thấy gói hội viên</h2>
          <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  // ✅ Xử lý xác nhận
  const handleConfirm = async () => {
    setError("");
    if (!user) {
      setError("⚠️ Bạn cần đăng nhập trước khi thao tác!");
      return;
    }

    // 🛑 ✅ Thêm kiểm tra chặn khi user đã có gói active
    if (isPremium && current.paymentType === "VNPay") {
      alert("✅ Bạn đã là hội viên Premium đang hoạt động, không thể mua lại!");
      return;
    }

    try {
      setLoading(true);

      if (current.paymentType === "VNPay") {
        if (isPremium) {
          alert("✅ Bạn đã là hội viên Premium!");
          return;
        }

        const payload = {
          PackageId: current.id,
          StartDate: new Date().toISOString().split("T")[0],
          DurationMonth: "1",
        };

        // ✅ Gọi API đúng luồng Subscription
        const res = await premiumService.createSubscription(payload);
        if (res?.vnpUrl) {
          window.location.href = res.vnpUrl.replace(/&amp;/g, "&");
        } else {
          setError(res?.message || "Không nhận được đường dẫn thanh toán.");
        }
      } else {
        if (isBusiness) {
          alert("✅ Tài khoản này đã là doanh nghiệp!");
          return;
        }

        const res = await businessService.requestUpgrade(user.userId);
        if (res.success) {
          alert("🎯 Yêu cầu nâng cấp doanh nghiệp đã được gửi! Vui lòng chờ admin duyệt.");
          navigate("/premium");
        } else {
          setError(res.message || "Không thể gửi yêu cầu nâng cấp.");
        }
      }
    } catch (err) {
      console.error("❌ Lỗi khi xử lý:", err);
      setError("❌ Có lỗi xảy ra khi xử lý.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Giao diện hiển thị (giữ nguyên)
  return (
    <div className="detail-container">
      <div className="detail-card fade-in">
        <h2>{current.title}</h2>
        <p className="desc">{current.desc}</p>

        <h4>Quyền lợi:</h4>
        <ul className="benefit-list">
          {current.benefits.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        {error && <p className="error-text">{error}</p>}

        {/* 🟢 Premium Info */}
        {isPremium && type === "plan-premium" && membership && (
          <div className="membership-info">
            <h3>
              🎉 Bạn đã là hội viên <span className="highlight">Premium</span>
            </h3>
            <p><b>Mã gói:</b> {membership.PackageId}</p>
            <p><b>Bắt đầu:</b> {new Date(membership.StartDate).toLocaleDateString()}</p>
            <p><b>Hết hạn:</b> {new Date(membership.ExpireDate).toLocaleDateString()}</p>
            <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
              ← Quay lại
            </button>
          </div>
        )}

        {/* 🟣 Business */}
        {type === "plan-business" && (
          <div className="membership-info">
            {isBusiness ? (
              <>
                <h3>
                  💼 Bạn đang sử dụng <span className="highlight">Tài Khoản Doanh Nghiệp</span>
                </h3>
                <p>
                  🔹 Quản lý nhiều phương tiện & nhân viên <br />
                  🔹 Báo cáo doanh thu định kỳ <br />
                  🔹 Thanh toán qua Ví Trả Sau
                </p>
              </>
            ) : (
              <>
                <p>
                  Bạn có thể gửi yêu cầu nâng cấp tài khoản doanh nghiệp để quản lý nhiều phương tiện và nhân viên hiệu quả hơn.
                </p>
                <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
                  {loading ? "Đang xử lý..." : "Gửi Yêu Cầu Nâng Cấp"}
                </button>
              </>
            )}
            <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
              ← Quay lại
            </button>
          </div>
        )}

        {/* 🔹 Nếu chưa có gói Premium */}
        {!isPremium && type === "plan-premium" && (
          <div className="action-group">
            <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
            </button>
            <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
              ← Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumDetail;
