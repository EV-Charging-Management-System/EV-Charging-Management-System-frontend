import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import ProfileStaff from "../../Customhooks/ProfileStaff";
import "../../css/Location.css";

const stations = [
  { id: 1, name: "Trạm SCG Q1", lat: 10.7765, lng: 106.7009, address: "Quận 1", status: "active" },
  { id: 2, name: "Trạm VinFast Q3", lat: 10.779, lng: 106.703, address: "Quận 3", status: "busy" },
  { id: 3, name: "Trạm EVN Q1", lat: 10.782, lng: 106.707, address: "Quận 3", status: "active" },
  { id: 4, name: "Trạm Tesla Q1", lat: 10.774, lng: 106.710, address: "Quận 3", status: "offline" },
  { id: 5, name: "Trạm Shell Q1", lat: 10.770, lng: 106.705, address: "Quận 1", status: "active" },
  { id: 6, name: "Trạm Total Q3", lat: 10.775, lng: 106.708, address: "Quận 3", status: "busy" },
  { id: 7, name: "Trạm Circle K Q1", lat: 10.778, lng: 106.702, address: "Quận 1", status: "active" },
  { id: 8, name: "Trạm EVN Q3", lat: 10.773, lng: 106.706, address: "Quận 3", status: "active" },
  { id: 9, name: "Trạm VinFast Q1", lat: 10.771, lng: 106.704, address: "Quận 1", status: "offline" },
  { id: 10, name: "Trạm Tesla Q3", lat: 10.779, lng: 106.709, address: "Quận 3", status: "active" },
  { id: 11, name: "Trạm SCG Q3", lat: 10.776, lng: 106.711, address: "Quận 3", status: "busy" },
  { id: 12, name: "Trạm Shell Q3", lat: 10.772, lng: 106.703, address: "Quận 1", status: "active" },
  { id: 13, name: "Trạm Circle K Q3", lat: 10.775, lng: 106.701, address: "Quận 1", status: "offline" },
  { id: 14, name: "Trạm EVN Q1", lat: 10.778, lng: 106.705, address: "Quận 3", status: "active" },
  { id: 15, name: "Trạm VinFast Q1", lat: 10.777, lng: 106.703, address: "Quận 1", status: "busy" },
];

const defaultCenter = { lat: 10.7765, lng: 106.7009 };

const Location: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDdxswSYXCcEgs8I4GJTPR82Dqpjkon1TM",
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) return <div className="map-loading">Đang tải bản đồ...</div>;

  const markersToShow = selectedStationId
    ? stations.filter(s => s.id === selectedStationId)
    : stations;

  return (
    <div className="location-wrapper">
      <aside className="location-sidebar-hover">
        <div className="location-sidebar">
          <div className="location-logo">⚡ EV STAFF</div>
          <nav className="location-menu">
            <ul>
              <li onClick={() => navigate("/staff")}>About</li>
              <li className="active" onClick={() => navigate("/staff/location")}>Location</li>
              <li onClick={() => navigate("/staff/sessions")}>Sessions</li>
              <li onClick={() => navigate("/staff/invoice")}>Invoice</li>
              <li onClick={() => navigate("/staff/report")}>Report To Admin</li>
              <li onClick={() => navigate("/staff/settings")}>Settings</li>
            </ul>
          </nav>
          <button className="logout-btn" onClick={() => navigate("/")}>← Exit</button>
        </div>
      </aside>

      <div className={`location-main-wrapper ${showContent ? "fade-in" : "hidden"}`}>
        <main className="location-main">
          <header className="location-header">
            <h1>Location Management</h1>
            <div className="location-header-actions">
              <ProfileStaff />
            </div>
          </header>

          <section className="location-body">
            <div className="location-map-container">
              <div className="location-left-panel center-panel">
                <h2>Hệ thống Trạm sạc Thành Phố Hồ Chí Minh</h2>
                <label>Khu vực tìm kiếm:</label>
                <select
                  onChange={(e) => {
                    const stationId = Number(e.target.value);
                    setSelectedStationId(stationId || null);
                    const station = stations.find(s => s.id === stationId);
                    if (station) setMapCenter({ lat: station.lat, lng: station.lng });
                  }}
                  value={selectedStationId || ""}
                >
                  <option value="">-- Chọn trạm --</option>
                  {stations.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="location-right-map">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={15}
                >
                  {markersToShow.map(station => (
                    <Marker
                      key={station.id}
                      position={{ lat: station.lat, lng: station.lng }}
                      onClick={() => setActiveMarker(station.id)}
                    >
                      {activeMarker === station.id && (
                        <InfoWindow
                          options={{ pixelOffset: new window.google.maps.Size(0, -35), maxWidth: 0 }}
                          onCloseClick={() => setActiveMarker(null)}
                        >
                          <div className="info-window">
                            <p><strong>{station.name}</strong></p>
                            <p>Địa chỉ: {station.address}</p>
                            <p>Trạng thái: {station.status}</p>
                            <button onClick={() => navigate(`/staff/locationDetail/${station.id}`)}>
                              Xem chi tiết
                            </button>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">@SWP Staff Fall 2025</footer>
      </div>
    </div>
  );
};

export default Location;
