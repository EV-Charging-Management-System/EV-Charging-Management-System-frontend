import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VnPayReturn: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("🔄 Đang xử lý giao dịch VNPay...");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const transactionStatus = params.get("vnp_TransactionStatus");
    const txnRef = params.get("vnp_TxnRef");
    const amount = params.get("vnp_Amount");

    console.log("💳 [VNPay Return Params]:", {
      responseCode,
      transactionStatus,
      txnRef,
      amount,
    });

    if (!responseCode || !transactionStatus) {
      setStatusText("⚠️ Không tìm thấy thông tin giao dịch VNPay.");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (responseCode === "00" && transactionStatus === "00") {
      setStatusText("✅ Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
      setIsSuccess(true);
      setLoading(false);

      // ⏳ Điều hướng sau 2s
      setTimeout(() => navigate("/payment-success"), 2000);
    } else {
      setStatusText("❌ Thanh toán thất bại hoặc bị hủy!");
      setIsSuccess(false);
      setLoading(false);

      // ⏳ Điều hướng sau 2s
      setTimeout(() => navigate("/payment-failed"), 2000);
    }
  }, [location, navigate]);

  const txnRef = new URLSearchParams(location.search).get("vnp_TxnRef");
  const amount = new URLSearchParams(location.search).get("vnp_Amount");

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(180deg, #06121b, #0a1f2a)",
        color: isSuccess === null ? "#00ffa3" : isSuccess ? "#00ffa3" : "#ff5252",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        transition: "color 0.3s ease",
      }}
    >
      <h2 style={{ fontSize: "28px", textShadow: "0 0 10px #00ffa3", marginBottom: "10px" }}>
        {statusText}
      </h2>
      {!loading && (
        <>
          <div
            style={{
              marginTop: "20px",
              padding: "15px 25px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ddd",
            }}
          >
            <p>
              <b>Mã giao dịch:</b> {txnRef || "Không có"}
            </p>
            <p>
              <b>Số tiền:</b>{" "}
              {amount ? `${Number(amount) / 100} VNĐ` : "Không xác định"}
            </p>
          </div>
          <p style={{ marginTop: "20px", color: "#aef7d3", fontSize: "15px" }}>
            Bạn sẽ được chuyển hướng trong giây lát...
          </p>
        </>
      )}
    </div>
  );
};

export default VnPayReturn;
