import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import "../css/AdminDashboard.css";
import type { StationAddress } from "utils/types";

interface CreateStaffProps {
  onCreated?: () => void; // callback sau khi tạo thành công
}

const CreateStaff: React.FC<CreateStaffProps> = ({ onCreated }) => {
  const [userName, setUserName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<StationAddress[]>([]);

  const getAddress = async () => {
    try {
      const res = await adminService.getAllStations();
      setStations(res);
      return res;
    }
    catch (error) {
      console.error("⚠️ Lỗi lấy danh sách trạm:", error);
      return [];
    }
  };
  useEffect(() => {
    getAddress();
  }, []);
  const handleCreate = async () => {
    if (!userName || !mail || !password || !address ) {
      toast.warn("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await adminService.createStaff(mail, password, userName, address); // ✅ đúng thứ tự: email, password, fullname, address

      if (res.success) {
        toast.success("✅ Tạo tài khoản staff thành công!");
        setUserName("");
        setMail("");
        setPassword("");
        if (onCreated) onCreated(); // gọi callback để reload list
      } else {
        toast.error(res.message || "❌ Lỗi khi tạo staff!");
      }
    } catch (err) {
      toast.error("❌ Lỗi khi tạo staff!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-create-container">
      <h2 className="staff-title">
        <UserPlus size={22} /> Tạo tài khoản <span>Staff</span> mới
      </h2>

      <div className="staff-form">
        <div className="form-group">
          <label>Tên nhân viên</label>
          <input
            type="text"
            placeholder="Nhập tên..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Station Address</label>
          <select
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          >
            <option value="">-- Chọn địa chỉ trạm --</option>
            {stations.map((s) => (
              <option key={s.stationId} value={s.Address}>
                {s.Address}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email công ty..."
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Tạo mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        className="btn-create-staff"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "⏳ Đang tạo..." : "Tạo tài khoản"}
      </button>
    </div>
  );
};

export default CreateStaff;
