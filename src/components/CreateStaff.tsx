import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import "../css/AdminDashboard.css";
import type { StationAddress } from "utils/types";

interface CreateStaffProps {
  onCreated?: () => void; // callback after successful creation
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
      console.error("⚠️ Error fetching station list:", error);
      return [];
    }
  };
  useEffect(() => {
    getAddress();
  }, []);
  const handleCreate = async () => {
    if (!userName || !mail || !password || !address ) {
      toast.warn("⚠️ Please fill in all information!");
      return;
    }

    setLoading(true);
    try {
      const res = await adminService.createStaff(mail, password, userName, address); // ✅ correct order: email, password, fullname, address

      if (res.success) {
        toast.success("✅ Staff account created successfully!");
        setUserName("");
        setMail("");
        setPassword("");
        if (onCreated) onCreated(); // call callback to reload list
      } else {
        toast.error(res.message || "❌ Error creating staff!");
      }
    } catch (err) {
      toast.error("❌ Error creating staff!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-create-container">
      <h2 className="staff-title">
        <UserPlus size={22} /> Create new <span>Staff</span> account
      </h2>

      <div className="staff-form">
        <div className="form-group">
          <label>Staff Name</label>
          <input
            type="text"
            placeholder="Enter name..."
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
            <option value="">-- Select station address --</option>
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
            placeholder="Company email..."
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create password..."
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
        {loading ? "⏳ Creating..." : "Create account"}
      </button>
    </div>
  );
};

export default CreateStaff;
