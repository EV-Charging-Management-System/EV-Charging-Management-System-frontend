import React, { useEffect, useState } from "react";
import { adminService } from "../../../services/adminService";
import { toast } from "react-toastify";
import { Percent } from "lucide-react";

const DiscountSection: React.FC = () => {
  const [percent, setPercent] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiscount();
  }, []);

  const loadDiscount = async () => {
    try {
      const disc = await adminService.getDiscount();   // GET /discount
      const current = disc?.Premium ?? 0;              // BE trả dạng: { Premium: 100, Guest: 0 }
      setPercent(current);
      setLoading(false);
    } catch {
      toast.error("Unable to load discount data!");
    }
  };

  const updateAllDiscount = async () => {
    try {
      await adminService.updatePremiumDiscount({ percent });
      toast.success("Discount updated successfully!");
      loadDiscount();
    } catch {
      toast.error("Error updating discount!");
    }
  };

  if (loading) return <p className="text-white p-8">Loading...</p>;

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-white mb-8">
        Discount for All Subscription Packages
      </h2>

      <div
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
            Discount applied to all packages
          </h3>
          <p className="text-gray-400">
            Current discount value: {percent}% 
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="number"
            value={percent}
            min={0}
            max={100}
            onChange={(e) => setPercent(Number(e.target.value))}
            style={{
              width: "80px",
              padding: "12px",
              borderRadius: "10px",
              background: "#1e293b",
              color: "white",
              border: "1px solid #334155",
            }}
          />

          <button
            onClick={updateAllDiscount}
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
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;
