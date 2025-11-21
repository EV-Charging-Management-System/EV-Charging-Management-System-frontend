import React from "react";
import ProfileStaff from "../../components/ProfileStaff";
import StaffSideBar from "../../pages/layouts/staffSidebar";
import { 
  StationInfo, 
  ChargerGrid, 
  BookingForm 
} from "../../components/staff/locationDetail";
import { useLocationDetail } from "../../components/staff/locationDetail/useLocationDetail";
import "../../css/LocationDetail.css";

const LocationDetail: React.FC = () => {
  const {
    fadeIn,
    station,
    chargers,
    ports,
    showForm,
    userType,
    form,
    loadingStation,
    loadingChargers,
    loadingPorts,
    loadingSubmit,
    openForm,
    setShowForm,
    setUserType,
    handleLicenseChange,
    handleLookupCompany,
    handlePortSelect,
    handleSubmit,
  } = useLocationDetail();

  return (
    <div className="location-wrapper">
      <StaffSideBar />
      <div className={`location-main-wrapper ${fadeIn ? "fade-in" : "hidden"}`}>
        <main className="location-main">
          <header className="location-header">
            <h1>Chi tiết trạm sạc</h1>
            <div className="location-header-actions">
              <ProfileStaff />
            </div>
          </header>

          <section className="detail-body">
            <StationInfo station={station} loading={loadingStation} />
            
            <ChargerGrid
              chargers={chargers}
              loading={loadingChargers}
              onOpenForm={openForm}
            />

            <BookingForm
              show={showForm}
              userType={userType}
              form={form}
              ports={ports}
              loadingPorts={loadingPorts}
              loadingSubmit={loadingSubmit}
              onClose={() => setShowForm(false)}
              onUserTypeChange={setUserType}
              onLicenseChange={handleLicenseChange}
              onLookup={handleLookupCompany}
              onPortSelect={handlePortSelect}
              onSubmit={handleSubmit}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default LocationDetail;
