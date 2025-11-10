
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stationId = 1;

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
      const staffRes = await fetch(`${API_BASE}/api/staff/station/${stationId}/sessions`, {
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
      
      // Log để debug xem có guest sessions không
      const guestSessions = sessionsRaw.filter((s: any) => !s.LicensePlate || s.LicensePlate === null);
      const staffSessions = sessionsRaw.filter((s: any) => s.LicensePlate && s.LicensePlate !== null);
      console.log("👥 Staff sessions (có LicensePlate):", staffSessions.length, staffSessions.map((s: any) => s.SessionId));
      console.log("👤 Guest sessions (không LicensePlate):", guestSessions.length, guestSessions.map((s: any) => s.SessionId));
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

        return {
          ...s,
          chargerName: port ? `${port.PortType} - ${port.PortTypeOfKwh} kWh` : "Cổng chưa rõ",
          power: port ? `${port.PortTypeOfKwh} kW` : "0 kW",
          portPrice: price,
          Status: status,
          address: stationMap[s.StationId] || "Địa chỉ chưa rõ",
          date: s.CheckinTime ? new Date(s.CheckinTime).toLocaleDateString("vi-VN") : "Chưa rõ",
          time: s.CheckinTime ? new Date(s.CheckinTime).toLocaleTimeString("vi-VN", { hour:"2-digit", minute:"2-digit"}) : "--:--",
          // Xác định userType: Nếu không có LicensePlate hoặc LicensePlate = null thì là guest
          userType: (!s.LicensePlate || s.LicensePlate === null) ? "guest" : "staff",
          batteryPercentage: s.BatteryPercentage,
        };
      });

      // Lọc sessions: Chỉ lấy sessions chưa kết thúc (CheckoutTime = NULL)
      const activeSessions = sessionsProcessed.filter(s => {
        const rawSession = sessionsRaw.find((raw: any) => raw.SessionId === s.SessionId);
        const hasCheckoutTime = rawSession?.CheckoutTime;
        
        console.log(`Session #${s.SessionId}: LicensePlate=${s.LicensePlate}, userType=${s.userType}, CheckoutTime=${hasCheckoutTime}, Status=${s.ChargingStatus}`);
        
        // Chỉ hiển thị sessions chưa có CheckoutTime (chưa end)
        return !hasCheckoutTime;
      });
      console.log("✅ Active sessions (CheckoutTime = NULL):", activeSessions.length);
      console.log("📋 Active session IDs:", activeSessions.map(s => `#${s.SessionId} (${s.userType})`));
      setSessions(activeSessions);
    } catch (err: any) {
      console.error("❌ Fetch sessions error:", err);
      alert(`⚠️ Lỗi tải session: ${err.message}`);
    }
  };

  // --------------------- START CHARGING ---------------------
  const startCharging = async (session: Session) => {
    const randomBattery = session.userType === "guest"
      ? session.inputBattery ?? Math.floor(Math.random() * (90 - 30 + 1)) + 30
      : Math.floor(Math.random() * (90 - 30 + 1)) + 30;

    setActiveSession({ ...session, Status: "charging" });
    setBattery(randomBattery);
    setElapsedSeconds(0);
    setStartTime(new Date());
    setCost(0);

    const pricePerKwh = Number(session.portPrice) || 0;
    const power = Number(session.power?.replace(" kW", "")) || 0;
  
const timeMultiplier = 60; // 1 giây thật = 1 phút mô phỏng

const chargeRate = (power / 100) / 3600 * 100; // % pin mỗi giây thật
const costPerSecond = (power * pricePerKwh) / 3600; // tiền mỗi giây thật

intervalRef.current = setInterval(() => {
  setElapsedSeconds(prev => prev + timeMultiplier);
  setBattery(prev => Math.min(prev + chargeRate * timeMultiplier, 100));
  setCost(prev => prev + costPerSecond * timeMultiplier);
}, 1000);


    alert(`✅ Bắt đầu sạc, pin hiện tại ${randomBattery}%`);
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }
    const bodyreq = {
        "id": session.SessionId,
        "batteryPercentage" : randomBattery,
  }
    const res = await fetch(`${API_BASE}/api/charging-session/setBatteryPercentage`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` },
      body: JSON.stringify(bodyreq),
 });
    fetchSessions();
  };

  // --------------------- END CHARGING ---------------------
  const endCharging = async () => {
    if (!activeSession) return;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }

    try {
      const url = activeSession.userType === "guest"
        ? `${API_BASE}/api/charging-session/guest/${activeSession.SessionId}/end`
        : `${API_BASE}/api/charging-session/staff/${activeSession.SessionId}/end`;

      console.log("🔚 Ending session:", {
        sessionId: activeSession.SessionId,
        userType: activeSession.userType,
        licensePlate: activeSession.LicensePlate,
        url: url
      });

      const res = await fetch(url, { method:"PATCH", headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      
      console.log("📥 End session response:", data);
      console.log("📊 Response status:", res.status);
      console.log("📋 Response data:", JSON.stringify(data, null, 2));
      
      if (!res.ok) throw new Error(data.message || "Lỗi kết thúc phiên sạc");

      setSessions(prev => prev.filter(s => s.SessionId !== activeSession.SessionId));

      // ✅ Nếu là EV-Driver: Fetch invoice và hiển thị thông tin
      if (activeSession.userType === "staff" || activeSession.LicensePlate) {
        console.log("🔍 Fetching invoice for session:", activeSession.SessionId);
        
        try {
          // Gọi API lấy invoice theo sessionId
          const invoiceData = await invoiceService.getInvoiceBySessionId(activeSession.SessionId);
          console.log("✅ Invoice fetched successfully:", invoiceData);
          
          const invoice = invoiceData.data || invoiceData;
          const invoiceId = invoice?.invoiceId || "N/A";
          const totalAmount = invoice?.totalAmount || 0;
          const paidStatus = invoice?.PaidStatus || "UNKNOWN";
          
          alert(
            `✅ Kết thúc sạc thành công!\n\n` +
            `🚗 Xe: ${activeSession.LicensePlate}\n` +
            `💰 Tổng tiền: ${totalAmount.toLocaleString()}₫\n\n` +
            `🧾 INVOICE ĐÃ TẠO:\n` +
            `   - Invoice ID: ${invoiceId}\n` +
            `   - Session ID: ${activeSession.SessionId}\n` +
            `   - Trạng thái: ${paidStatus}\n\n` +
            `✅ Hóa đơn đã được gửi đến tài khoản khách hàng.\n` +
            `📱 Khách hàng sẽ thanh toán qua app của họ.`
          );
        } catch (invoiceError: any) {
          console.error("❌ Failed to fetch invoice:", invoiceError);
          alert(
            `✅ Kết thúc sạc thành công!\n\n` +
            `🚗 Xe: ${activeSession.LicensePlate}\n` +
            `💰 Chi phí ước tính: ${cost.toFixed(0)}₫\n\n` +
            `⚠️ Không thể lấy thông tin invoice:\n${invoiceError.message}\n\n` +
            `Vui lòng kiểm tra lại trong hệ thống.`
          );
        }
        
        setActiveSession(null);
        setElapsedSeconds(0);
        setCost(0);
      } else {
        // Nếu là Guest: Chuyển sang trang Invoice để thu tiền ngay
        alert(`✅ Kết thúc sạc. Tổng tiền: ${cost.toFixed(0)}₫\n\nChuyển sang thanh toán...`);
        navigate('/staff/invoice', { state: { session: activeSession, cost } });
        setActiveSession(null);
        setElapsedSeconds(0);
        setCost(0);
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
                  <p>{activeSession.userType === "guest" ? `Pin: ${activeSession.batteryPercentage}` : `Biển số: ${activeSession.LicensePlate}`}</p>
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
                    <p>{s.userType === "guest" ? `Pin: ${s.batteryPercentage}` : `Biển số: ${s.LicensePlate}`}</p>
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
