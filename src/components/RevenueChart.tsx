import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminService } from "../services/adminService";

const RevenueChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const res = await adminService.getMonthlyRevenue(); // Backend API
        console.log("📊 Revenue chart data:", res);

        if (Array.isArray(res)) {
          setData(res);
        }
      } catch (err) {
        console.error("❌ Error loading chart data:", err);
      }
    };
    loadChartData();
  }, []);

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString("en-US") + " ₫"
            }
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #22c55e",
              color: "#e2e8f0",
            }}
          />
          <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart; // ✅ This line is extremely important
