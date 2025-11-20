import React, { useEffect, useState } from "react";
import { adminService } from "../../../services/adminService";
import { toast } from "react-toastify";
import { Percent } from "lucide-react";

const DiscountSection: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const pkg = await adminService.getAllPackages();   // GET /packages
      const disc = await adminService.getDiscount();     // GET /discount

      setPackages(pkg || []);
      setDiscounts(disc || {});
      setLoading(false);
    } catch {
      toast.error("Không thể tải dữ liệu giảm giá!");
    }
  };

  const updatePremium = async (percent: number) => {
    try {
      await adminService.updatePremiumDiscount({ percent });
      toast.success("Cập nhật Premium Discount thành công!");
      loadAllData();
    } catch {
      toast.error("Lỗi cập nhật Premium Discount!");
    }
  };

  if (loading)
    return <p className="text-white p-8">Loading...</p>;

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-white mb-8">
        Giảm giá các gói đăng ký
      </h2>

      <div className="space-y-4">
        {packages.map((pkg) => {
          const pkgName = pkg.PackageName;
          const currentDiscount = discounts[pkgName] ?? 0;
          const isPremium = pkgName.includes("Premium");

          return (
            <div
              key={pkg.PackageId}
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                padding: "25px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 0 10px rgba(0,255,163,0.08)"
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Percent size={20} color="#00ffa3" />
                  {pkgName}
                </h3>
                <p className="text-gray-400">
                  Giá: {pkg.PackagePrice.toLocaleString("vi-VN")}₫
                </p>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  defaultValue={currentDiscount}
                  min={0}
                  max={100}
                  onChange={(e) =>
                    (pkg.newValue = Number(e.target.value))
                  }
                  disabled={!isPremium}
                  style={{
                    width: "80px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#1e293b",
                    color: isPremium ? "white" : "#6b7280",
                    border: "1px solid #334155",
                  }}
                />

                {isPremium ? (
                  <button
                    onClick={() =>
                      updatePremium(pkg.newValue ?? currentDiscount)
                    }
                    style={{
                      padding: "12px 22px",
                      background: "#3b82f6",
                      color: "white",
                      fontWeight: "600",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Không hỗ trợ chỉnh sửa
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountSection;
