
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSidebar from "../../pages/layouts/staffSidebar";
import "../../css/ChargingProcessStaff.css";
import { FaMapMarkerAlt, FaBolt, FaCalendarAlt, FaClock, FaHashtag, FaSyncAlt } from "react-icons/fa";
import { Battery } from "lucide-react";
import { invoiceService } from "../../services/invoiceService";

interface Session {
  SessionId: number;
  UserId?: number | null; // ✅ Thêm UserId từ backend
  LicensePlate?: string | null;
  VehicleId?: number | null;
  companyName?: string;
  Battery?: number;
  PortId?: number;
  PointId?: number;
  StationId?: number;
  PortType?: string;
  ChargingStatus?: string;
  StationName?: string;
  chargerName?: string;
  power?: string;
  Status?: "waiting" | "charging" | "done";
  address?: string;
  date?: string;
  time?: string;
  portPrice?: number;
  userType?: "guest" | "staff";
  inputBattery?: number;
  batteryPercentage?: number;
}

const API_BASE = "http://localhost:5000";

const ChargingProcessStaff: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [battery, setBattery] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [ports, setPorts] = useState<any[]>([]);
  const intervalRef = useRef<number | null>(null);

  const stationId = 1;

  // ✅ Utility: Dọn dẹp userId cũ trong localStorage (sessions đã hoàn thành)
  const cleanupOldSessionUserIds = () => {
    try {
      const keys = Object.keys(localStorage);
      const sessionKeys = keys.filter(key => key.startsWith('session_') && key.endsWith('_userId'));
      
      // Chỉ giữ lại userId của các active sessions
      const activeSessionIds = sessions.map(s => s.SessionId);
      sessionKeys.forEach(key => {
        const sessionId = parseInt(key.replace('session_', '').replace('_userId', ''));
        if (!activeSessionIds.includes(sessionId)) {
          localStorage.removeItem(key);
          console.log(`🧹 Cleaned up old userId: ${key}`);
        }
      });
    } catch (error) {
      console.warn("⚠️ Error cleaning localStorage:", error);
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // --------------------- FETCH PORTS ---------------------
  const fetchPorts = async (pointId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/station/getPort?pointId=${pointId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setPorts(json.data || []);
    } catch (err: any) { console.error(err.message); }
  };

  // --------------------- FETCH SESSIONS ---------------------
  const fetchAllSessions = async (): Promise<any[]> => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return []; }
    
    try {
      // Fetch staff sessions
      const staffRes = await fetch(`${API_BASE}/api/staff/station/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const staffJson = await staffRes.json();
      const staffSessions = staffJson.data || [];
      console.log("📥 Staff sessions from API:", staffSessions.length);

      // Fetch guest sessions từ endpoint riêng
      let guestSessions = [];
      try {
        const guestRes = await fetch(`${API_BASE}/api/charging-session/guest/station/${stationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (guestRes.ok) {
          const guestJson = await guestRes.json();
          guestSessions = guestJson.data || guestJson || [];
          console.log("📥 Guest sessions from API:", guestSessions.length);
        }
      } catch (err) {
        console.warn("⚠️ Guest API not available, trying alternative...");
        // Thử endpoint khác
        try {
          const altRes = await fetch(`${API_BASE}/api/charging-session/station/${stationId}/guests`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (altRes.ok) {
            const altJson = await altRes.json();
            guestSessions = altJson.data || altJson || [];
            console.log("📥 Guest sessions from alternative API:", guestSessions.length);
          }
        } catch {
          console.error("❌ All guest endpoints failed");
        }
      }

      // Merge cả hai
      const allSessions = [...staffSessions, ...guestSessions];
      console.log("📊 Total merged sessions:", allSessions.length);
      return allSessions;
    } catch (err) { 
      console.error("❌ Fetch sessions error:", err);
      return []; 
    }
  };

  const fetchSessions = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }

    try {
      const sessionsRaw = await fetchAllSessions();
      console.log("📊 Total sessions fetched:", sessionsRaw.length);
      console.log("� Total sessions fetched:", sessionsRaw.length);
      
      // Log để debug xem có guest sessions không
      const guestSessions = sessionsRaw.filter((s: any) => !s.UserId || s.UserId === null);
      const staffSessions = sessionsRaw.filter((s: any) => s.UserId && s.UserId !== null);
      console.log("👥 Staff sessions (có UserId - có account):", staffSessions.length, staffSessions.map((s: any) => `#${s.SessionId} (UserId: ${s.UserId})`));
      console.log("👤 Guest sessions (không có UserId):", guestSessions.length, guestSessions.map((s: any) => s.SessionId));
      console.log("📊 Total sessions:", sessionsRaw.length);

      const stationRes = await fetch(`${API_BASE}/api/station/getAllStations`, { headers: { Authorization: `Bearer ${token}` } });
      const stationJson = await stationRes.json();
      const stationMap = Object.fromEntries(
        (stationJson.data || []).map((st: any) => [st.StationId, st.Address || "Địa chỉ chưa rõ"])
      );

      const uniquePoints = Array.from(new Set(sessionsRaw.map((s: any) => s.PointId)));
      const portsPromises = uniquePoints.map(async pid => {
        const r = await fetch(`${API_BASE}/api/station/getPort?pointId=${pid}`, { headers: { Authorization: `Bearer ${token}` } });
        const j = await r.json();
        return j.data || [];
      });
      const allPorts = (await Promise.all(portsPromises)).flat();
      setPorts(allPorts);

      const sessionsProcessed: Session[] = sessionsRaw.map((s: any) => {
        const port = allPorts.find((p) => p.PortId === s.PortId);
        const price = port?.PortTypePrice ? Number(port.PortTypePrice) : 0;

        // ChargingStatus chỉ có ONGOING hoặc COMPLETED
        let status: "waiting" | "charging" | "done";
        if (s.ChargingStatus === "ONGOING") {
          status = "waiting"; // Chưa bắt đầu sạc, đang chờ
        } else if (s.ChargingStatus === "COMPLETED") {
          status = "done"; // Đã hoàn thành
        } else {
          status = "waiting"; // Default
        }

        // ✅ Kiểm tra UserId từ backend hoặc localStorage
        let userId = s.UserId;
        if (!userId) {
          const userIdSessionKey = `session_${s.SessionId}_userId`;
          const savedUserId = localStorage.getItem(userIdSessionKey);
          if (savedUserId) {
            userId = parseInt(savedUserId);
            console.log(`📦 Retrieved userId from localStorage for session #${s.SessionId}: ${userId}`);
          }
        }

        return {
          ...s,
          UserId: userId, // ✅ Gán UserId từ backend hoặc localStorage
          chargerName: port ? `${port.PortType} - ${port.PortTypeOfKwh} kWh` : "Cổng chưa rõ",
          power: port ? `${port.PortTypeOfKwh} kW` : "0 kW",
          portPrice: price,
          Status: status,
          address: stationMap[s.StationId] || "Địa chỉ chưa rõ",
          date: s.CheckinTime ? new Date(s.CheckinTime).toLocaleDateString("vi-VN") : "Chưa rõ",
          time: s.CheckinTime ? new Date(s.CheckinTime).toLocaleTimeString("vi-VN", { hour:"2-digit", minute:"2-digit"}) : "--:--",
          // ✅ Xác định userType dựa vào UserId (có account) thay vì LicensePlate
          // Nếu có UserId thì là staff (có account), không có thì là guest
          userType: (userId && userId !== null) ? "staff" : "guest",
          batteryPercentage: s.BatteryPercentage,
        };
      });

      // Lọc sessions: Chỉ lấy sessions chưa kết thúc (CheckoutTime = NULL)
      const activeSessions = sessionsProcessed.filter(s => {
        const rawSession = sessionsRaw.find((raw: any) => raw.SessionId === s.SessionId);
        const hasCheckoutTime = rawSession?.CheckoutTime;
        
        console.log(`Session #${s.SessionId}: UserId=${rawSession?.UserId}, LicensePlate=${s.LicensePlate}, userType=${s.userType}, CheckoutTime=${hasCheckoutTime}, Status=${s.ChargingStatus}`);
        
        // Chỉ hiển thị sessions chưa có CheckoutTime (chưa end)
        return !hasCheckoutTime;
      });
      console.log("✅ Active sessions (CheckoutTime = NULL):", activeSessions.length);
      console.log("📋 Active session IDs:", activeSessions.map(s => `#${s.SessionId} (${s.userType})`));
      setSessions(activeSessions);
      
      // ✅ Dọn dẹp userId cũ trong localStorage sau khi fetch sessions
      setTimeout(() => cleanupOldSessionUserIds(), 1000);
    } catch (err: any) {
      console.error("❌ Fetch sessions error:", err);
      alert(`⚠️ Lỗi tải session: ${err.message}`);
    }
  };

  // --------------------- START CHARGING ---------------------
 const startCharging = async (session: Session) => {
  // ✅ Dùng đúng battery ban đầu nếu có
  const initialBattery = session.batteryPercentage ?? session.inputBattery ?? session.Battery ?? 50;

  setActiveSession({ ...session, Status: "charging" });
  setBattery(initialBattery);
  setElapsedSeconds(0);
  setStartTime(new Date());
  setCost(0);

  const pricePerKwh = Number(session.portPrice) || 0;
  const power = Number(session.power?.replace(" kW", "")) || 0;

  const timeMultiplier = 60; // 1 giây = 1 phút mô phỏng
  const chargeRate = (power / 100) / 3600 * 100;
  const costPerSecond = (power * pricePerKwh) / 3600;

  intervalRef.current = setInterval(() => {
    setElapsedSeconds(prev => prev + timeMultiplier);
    setBattery(prev => Math.min(prev + chargeRate * timeMultiplier, 100));
    setCost(prev => prev + costPerSecond * timeMultiplier);
  }, 1000);

  alert(`✅ Bắt đầu sạc, pin hiện tại ${initialBattery}%`);

  const token = localStorage.getItem("accessToken");
  if (!token) { navigate("/login"); return; }

  try {
    const bodyreq = {
      id: session.SessionId,
      batteryPercentage: initialBattery,
    };

    const res = await fetch(`${API_BASE}/api/charging-session/setBatteryPercentage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyreq),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Lỗi cập nhật battery");
    }

    await fetchSessions(); // refresh danh sách sessions
  } catch (err: any) {
    console.error("❌ Update battery error:", err);
    alert(`⚠️ Lỗi cập nhật pin: ${err.message}`);
  }
};


// --------------------- END CHARGING --------------------
const endCharging = async () => {
  if (!activeSession) {
    console.warn("⚠️ Không có activeSession, không thể kết thúc sạc");
    return;
  }

  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) { navigate("/login"); return; }

  try {
    const url = activeSession.userType === "guest"
      ? `${API_BASE}/api/charging-session/guest/${activeSession.SessionId}/end`
      : `${API_BASE}/api/charging-session/staff/${activeSession.SessionId}/end`;

    console.log("🔚 Ending session:", { sessionId: activeSession.SessionId, url });

    const res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await res.json();
    console.log("📥 End session response:", data);

    if (!res.ok) throw new Error(data.message || "Lỗi kết thúc phiên sạc");

    // ✅ Kiểm tra userId (có account hay khách vãng lai)
    const userIdSessionKey = `session_${activeSession.SessionId}_userId`;
    const savedUserId = localStorage.getItem(userIdSessionKey);
    const userId = activeSession.UserId || (savedUserId ? parseInt(savedUserId) : null);

    console.log(`🔍 Checking invoice creation:
    - SessionId: ${activeSession.SessionId}
    - UserId from session: ${activeSession.UserId}
    - UserId from localStorage: ${savedUserId}
    - Final userId: ${userId}
    - userType: ${activeSession.userType}`);

    // ✅ Nếu có userId (xe có tài khoản)
    if (userId) {
      try {
        console.log(`🧾 Creating invoice for staff session: ${activeSession.SessionId} with userId: ${userId}`);
        await invoiceService.createInvoiceForStaff(activeSession.SessionId, userId);
        console.log("✅ Invoice created successfully");

        if (savedUserId) {
          localStorage.removeItem(userIdSessionKey);
          console.log(`🗑️ Removed userId from localStorage: ${userIdSessionKey}`);
        }

        setSessions(prev => prev.filter(s => s.SessionId !== activeSession.SessionId));
        setActiveSession(null);
        setElapsedSeconds(0);
        setCost(0);

        alert("✅ Kết thúc sạc thành công!\n\nHóa đơn đã được tạo cho user.\nUser sẽ thanh toán trên app.");
      } catch (invoiceError: any) {
        console.error("❌ Failed to create invoice:", invoiceError);
        alert(`⚠️ Cảnh báo: Kết thúc sạc thành công nhưng không tạo được hóa đơn: ${invoiceError.message}`);
      }
    } 
    // ⚡ KHÁCH VÃNG LAI (Guest)
    else {
      try {
        console.log("💰 Guest session detected — creating CASH invoice...");
        await invoiceService.payCash(activeSession.SessionId);
        console.log("✅ Guest CASH invoice created successfully!");

        setSessions(prev => prev.filter(s => s.SessionId !== activeSession.SessionId));
        setActiveSession(null);
        setElapsedSeconds(0);
        setCost(0);

        alert("✅ Kết thúc sạc và tạo hóa đơn tiền mặt thành công!\n🧾 Chuyển sang trang hóa đơn...");
        navigate(`/staff/invoice?sessionId=${activeSession.SessionId}`);
      } catch (guestErr: any) {
        console.error("❌ Guest invoice creation failed:", guestErr);
        alert(`⚠️ Kết thúc sạc thành công nhưng không tạo được hóa đơn khách: ${guestErr.message}`);
      }
    }
  } catch (err: any) {
    console.error("❌ End charging error:", err);
    alert(`⚠️ Lỗi kết thúc sạc: ${err.message}`);
  }
};


  useEffect(() => {
    const loadData = async () => { await fetchPorts(1); await fetchSessions(); };
    loadData();
    return () => { if(intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="charging-wrapper">
      <StaffSidebar />
      <div className="charging-main-wrapper fade-in">
        <header className="charging-header">
          <h1>Optimising your journey, Powering your life ⚡</h1>
          <ProfileStaff />
        </header>

        <main className="charging-body">
          <h2 className="charging-title">
            {activeSession ? "Phiên Sạc Đang Diễn Ra" : "Lịch Sạc Sắp Tới"}
            {!activeSession && (<button onClick={fetchSessions} title="Làm mới danh sách"><FaSyncAlt /></button>)}
          </h2>

          {activeSession ? (
            <div className="charging-session-container">
              <div className="charge-progress">
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${battery}%` }}></div></div>
                <span className="battery-level">{battery.toFixed(0)}%</span>
              </div>
              <div className="session-info">
                <div className="info-box">
                  <h3>Xe & Trạm</h3>
                  <p><FaMapMarkerAlt /> {activeSession.StationName}</p>
                  <p><FaBolt /> {activeSession.chargerName} ({activeSession.power})</p>
                  <p>{activeSession.userType === "guest" ? `Pin: ${activeSession.batteryPercentage}%` : `Biển số: ${activeSession.LicensePlate}`}</p>
                  {activeSession.UserId && <p>UserId: {activeSession.UserId}</p>}
                  <p>Loại: {activeSession.userType === "guest" ? "Khách vãng lai" : "Có tài khoản"}</p>
                  <p>Giá: {activeSession.portPrice?.toLocaleString()} ₫/kWh</p>
                </div>
                <div className="info-box">
                  <h3>Thời gian & Chi phí</h3>
                  <p><FaClock /> {formatDuration(elapsedSeconds)}</p>
                  <p>Chi phí: {cost.toFixed(0)} ₫</p>
                  <p>Bắt đầu: {startTime?.toLocaleTimeString("vi-VN")}</p>
                </div>
              </div>
              <div className="charging-buttons">
                <button onClick={endCharging}>⏹ Dừng sạc</button>
              </div>
            </div>
          ) : (
            <div className="waiting-list">
              {sessions.length === 0 && <p>Chưa có phiên sạc nào</p>}
              {sessions.map(s => (
                <div key={s.SessionId} className="waiting-card">
                  <div>
                    <h3>{s.StationName}</h3>
                    <p><FaMapMarkerAlt /> {s.address}</p>
                    <p><FaBolt /> {s.chargerName} ({s.power})</p>
                    <p>{s.userType === "guest" ? `Pin: ${s.batteryPercentage}%` : `Biển số: ${s.LicensePlate}`}</p>
                    {s.UserId && <p>UserId: {s.UserId}</p>}
                    <p>Loại: {s.userType === "guest" ? "Khách vãng lai" : "Có tài khoản"}</p>
                    <p>Giá: {s.portPrice?.toLocaleString()} ₫/kWh</p>
                  </div>
                  <div>
                    <p><FaCalendarAlt /> {s.date}</p>
                    <p><FaClock /> {s.time}</p>
                    <p><FaHashtag /> #{s.SessionId}</p>
                  </div>
                  <div className="form-buttons">
                    <button className="start-btn" onClick={() => startCharging(s)}>Bắt đầu sạc</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChargingProcessStaff;
