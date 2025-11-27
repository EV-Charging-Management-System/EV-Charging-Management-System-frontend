import React from "react";
import StaffSidebar from "../../pages/layouts/staffSidebar";
import "../../css/ChargingProcessStaff.css";
import { 
  PageHeader, 
  ActiveSession, 
  WaitingList 
} from "../../components/staff/chargingProcess";
import { useChargingSessions } from "../../components/staff/chargingProcess/useChargingSessions";

const ChargingProcessStaff: React.FC = () => {
  const {
    sessions,
    activeSession,
    battery,
    elapsedSeconds,
    cost,
    startTime,
    fetchSessions,
    startCharging,
    endCharging,
  } = useChargingSessions();

  return (
    <div className="charging-wrapper">
      <StaffSidebar />
      <div className="charging-main-wrapper fade-in">
        <PageHeader 
          title="Optimising your journey," 
          subtitle="Powering your life ⚡" 
        />

        <main className="charging-body" style={{ background: 'linear-gradient(135deg, #02402cff 0%, #11071cff 100%)' }}>
          {activeSession ? (
        <>
          <h2 className="charging-title">Ongoing Charging Sessions</h2>
          <ActiveSession
            session={activeSession}
            battery={battery}
            elapsedSeconds={elapsedSeconds}
            cost={cost}
            startTime={startTime}
            onEndCharging={endCharging}
          />
        </>
          ) : (
        <WaitingList
          sessions={sessions}
          onStartCharging={startCharging}
          onRefresh={fetchSessions}
        />
          )}
        </main>
      </div>
    </div>
  );
};

export default ChargingProcessStaff;
