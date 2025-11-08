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
  const [isPendingBusiness, setIsPendingBusiness] = useState(false);
  const [membership, setMembership] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState({
    companyName: "",
    address: "",
    mail: "",
    phone: "",
  });

  // ✅ Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await authService.getProfile({ noCache: true });
        console.log("[PremiumDetail] 👤 User profile:", u);
        setUser(u);

        const role = (u?.roleName || u?.role || "").toUpperCase();
        const status = (u?.status || u?.Status || "").toUpperCase();

        setIsPremium(role === "PREMIUM");
        setIsBusiness(role === "BUSINESS");
        setIsPendingBusiness(status === "PENDING");
      } catch (err) {
        console.warn("⚠️ Không thể lấy thông tin người dùng:", err);
      }
    };
    fetchUser();
  }, []);

  // 🟢 Kiểm tra gói Premium hiện tại
  useEffect(() => {
    const checkCurrentSubscription = async () => {
      try {
        const res = await premiumService.getCurrentSubscription();
        if (res?.success && res?.data) {
          const sub = res.data;
          if (sub.SubStatus === "ACTIVE") {
            setIsPremium(true);
            setMembership(sub);
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
      const refreshAfterPayment = async () => {
        try {
          const res = await premiumService.getCurrentSubscription();
          if (res.success && res.data) {
            setIsPremium(true);
            setMembership(res.data);
          }
        } catch (err) {
          console.error("❌ Lỗi khi cập nhật Premium sau thanh toán:", err);
        }
      };
      refreshAfterPayment();
    }
  }, []);

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

    if (current.paymentType === "VNPay") {
      if (isPremium) {
        alert("✅ Bạn đã là hội viên Premium đang hoạt động!");
        return;
      }

      try {
        setLoading(true);
        const payload = {
          PackageId: current.id,
          StartDate: new Date().toISOString().split("T")[0],
          DurationMonth: "1",
        };
        const res = await premiumService.createSubscription(payload);
        if (res?.vnpUrl) {
          window.location.href = res.vnpUrl.replace(/&amp;/g, "&");
        } else {
          setError(res?.message || "Không nhận được đường dẫn thanh toán.");
        }
      } catch (err) {
        console.error("❌ Lỗi khi thanh toán Premium:", err);
        setError("Có lỗi khi xử lý thanh toán.");
      } finally {
        setLoading(false);
      }
    } else {
      if (isBusiness) {
        alert("✅ Tài khoản này đã là doanh nghiệp!");
        return;
      }
      if (isPendingBusiness) {
        alert("🕓 Yêu cầu của bạn đang được xét duyệt!");
        return;
      }
      setShowForm(true);
    }
  };

  // 🏢 Gửi form đăng ký doanh nghiệp
  const handleSubmitBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        userId: user?.UserId || user?.userId,
        companyName: company.companyName,
        address: company.address,
        mail: company.mail,
        phone: company.phone,
      };

      const res = await businessService.createCompany(payload);
      if (res?.companyId) {
        alert("🎯 Gửi yêu cầu nâng cấp doanh nghiệp thành công! Vui lòng chờ admin duyệt.");
        setShowForm(false);
        setIsPendingBusiness(true);
      } else {
        setError(res?.message || "Không thể gửi yêu cầu nâng cấp.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi gửi yêu cầu doanh nghiệp:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

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

        {/* 🟣 Gói Business */}
        {type === "plan-business" && (
          <div className="membership-info">
            {isBusiness ? (
              <>
                <h3>💼 Bạn đang sử dụng <span className="highlight">Tài Khoản Doanh Nghiệp</span></h3>
                <p>Quản lý nhiều phương tiện, nhân viên và doanh thu định kỳ.</p>
              </>
            ) : isPendingBusiness ? (
              <>
                <h3>🕓 Yêu cầu nâng cấp đang chờ admin duyệt</h3>
                <p>Chúng tôi sẽ gửi thông báo ngay khi tài khoản của bạn được phê duyệt.</p>
              </>
            ) : (
              <>
                <p>Gửi yêu cầu nâng cấp tài khoản doanh nghiệp để quản lý nhiều phương tiện và nhân viên.</p>
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

        {/* 🔹 Premium */}
        {type === "plan-premium" && (
          <>
            {isPremium ? (
              <div className="membership-info">
                <h3>✅ Bạn hiện đang là <span className="highlight">Hội Viên Premium</span></h3>
                <p>
                  📅 <strong>Hiệu lực:</strong>{" "}
                  {membership?.StartDate
                    ? new Date(membership.StartDate).toLocaleDateString()
                    : "N/A"}{" "}
                  -{" "}
                  {membership?.EndDate
                    ? new Date(membership.EndDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>💎 Trạng thái: <strong>{membership?.SubStatus || "ACTIVE"}</strong></p>
                <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
                  ← Quay lại
                </button>
              </div>
            ) : (
              <div className="action-group">
                <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
                  {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
                </button>
                <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
                  ← Quay lại
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🏢 Modal form doanh nghiệp */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🏢 Đăng Ký Tài Khoản Doanh Nghiệp</h2>
            <form onSubmit={handleSubmitBusiness}>
              <label>Tên công ty</label>
              <input
                type="text"
                value={company.companyName}
                onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                required
              />

              <label>Địa chỉ</label>
              <input
                type="text"
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                required
              />

              <label>Email công ty</label>
              <input
                type="email"
                value={company.mail}
                onChange={(e) => setCompany({ ...company, mail: e.target.value })}
                required
              />

              <label>Số điện thoại</label>
              <input
                type="tel"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                required
              />

              <div className="form-buttons">
                <button type="submit" className="confirm-btn">
                  Gửi Yêu Cầu
                </button>
                <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
                  ← hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumDetail;
