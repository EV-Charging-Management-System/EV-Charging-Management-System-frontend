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

        <main className="charging-body">
          {activeSession ? (
            <>
              <h2 className="charging-title">Phiên Sạc Đang Diễn Ra</h2>
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
