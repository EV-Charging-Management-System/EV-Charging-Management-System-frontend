import React, { useEffect, useState } from "react";
import "../../../css/Premium.css";
import { apiClient } from "../../../utils/api";

import Header from "../../../pages/layouts/header";
import Footer from "../../../pages/layouts/footer";
import MenuBar from "../../../pages/layouts/menu-bar";

import PremiumList from "./PremiumList";


const Premium: React.FC = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    apiClient.get("/packages")
      .then((res) => setPackages(res.data.data || []))
      .catch((err) => console.error("❌ Lỗi khi lấy packages:", err));
  }, []);

  const premium1 = packages.find((p) => p.PackageName.includes("1 tháng"));
  const premium3 = packages.find((p) => p.PackageName.includes("3 tháng"));
  const premium6 = packages.find((p) => p.PackageName.includes("6 tháng"));
  const premium12 = packages.find((p) => p.PackageName.includes("12 tháng"));
  const business = packages.find((p) => p.PackageName.includes("Business"));

  return (
    <div className="member-container">
      <Header />
      <MenuBar />

      <main className="member-body">
        <h1 className="member-title">
          Trải Nghiệm Đặc Quyền - Nâng Tầm Hội Viên  
          <br /> Chọn Gói Phù Hợp Cho Bạn
        </h1>

        <PremiumList
          premium1={premium1}
          premium3={premium3}
          premium6={premium6}
          premium12={premium12}
          business={business}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
