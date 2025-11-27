import React from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { StaffAddress } from './types';

interface StationMapProps {
  stations: StaffAddress[];
  mapCenter: { lat: number; lng: number };
  activeMarker: number | null;
  selectedStationId: number | null;
  onMarkerClick: (stationId: number) => void;
  onInfoWindowClose: () => void;
}

const StationMap: React.FC<StationMapProps> = ({
  stations,
  mapCenter,
  activeMarker,
  selectedStationId,
  onMarkerClick,
  onInfoWindowClose,
}) => {
  const navigate = useNavigate();
  const defaultCenter = { lat: 10.7765, lng: 106.7009 };

  const markersToShow = selectedStationId != null
    ? stations.filter((s) => s.StationId === selectedStationId)
    : stations;

  return (
    <div className='location-right-map'>
      <GoogleMap 
        mapContainerClassName='map-container' 
        center={mapCenter} 
        zoom={15}
      >
        {markersToShow.map((station) => (
          <Marker
            key={station.StationId}
            position={{ 
              lat: station.lat ?? defaultCenter.lat, 
              lng: station.lng ?? defaultCenter.lng 
            }}
            onClick={() => onMarkerClick(station.StationId)}
            title={station.StationName}
            icon={{
              url: station.StationId === selectedStationId
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }}
          >
            {activeMarker === station.StationId && (
              <InfoWindow
                options={{ pixelOffset: new window.google.maps.Size(0, -35) }}
                onCloseClick={onInfoWindowClose}
              >
                <div className='info-window'>
                  <p><strong>{station.StationName}</strong></p>
                  <p>📍 Address: {station.address}</p>
                  <p>⚡ Status: {station.status}</p>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() =>
                      navigate(`/staff/locationDetail/${encodeURIComponent(station.address)}`)
                    }
                  >
                    View station details
                  </Button>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
};

export default StationMap;
