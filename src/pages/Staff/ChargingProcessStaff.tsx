
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSidebar from "../../pages/layouts/staffSidebar";
import "../../css/ChargingProcessStaff.css";
import { FaMapMarkerAlt, FaBolt, FaCalendarAlt, FaClock, FaHashtag, FaSyncAlt } from "react-icons/fa";
import { Battery } from "lucide-react";

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
  const fetchStaffSessions = async (): Promise<any[]> => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return []; }
    try {
      const res = await fetch(`${API_BASE}/api/staff/station/${stationId}/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      return json.data || [];
    } catch { return []; }
  };

  const fetchGuestSessions = async (): Promise<any[]> => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return []; }
    try {
      const res = await fetch(`${API_BASE}/api/charging-session/guest?stationId=${stationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      return json.data || [];
    } catch { return []; }
  };

  const fetchSessions = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }

    try {
      const [staffRaw, guestRaw] = await Promise.all([fetchStaffSessions(), fetchGuestSessions()]);
      const sessionsRaw = [...staffRaw, ...guestRaw];

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

        let status: "waiting" | "charging" | "done";
        switch(s.ChargingStatus) {
          case "ONGOING": status = "charging"; break;
          case "DONE": status = "done"; break;
          default: status = "waiting";
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
          userType: s.userType || (s.LicensePlate ? "staff" : "guest"),
          batteryPercentage: s.BatteryPercentage,
        };
      });

      setSessions(sessionsProcessed.filter(s => s.ChargingStatus === "ONGOING"));
    } catch (err: any) {
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

      const res = await fetch(url, { method:"PATCH", headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(`✅ Kết thúc sạc. Tổng tiền: ${cost.toFixed(0)}₫`);

      setSessions(prev => prev.filter(s => s.SessionId !== activeSession.SessionId));

      // Truyền toàn bộ session + cost sang trang invoice
      navigate('/staff/invoice', { state: { session: activeSession, cost } });

      setActiveSession(null);
      setElapsedSeconds(0);
      setCost(0);
    } catch (err: any) {
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
