import React from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { StationInfoWindow } from './StationInfoWindow'
import type { StationData, MapCenter } from './types'

interface MapSectionProps {
  isLoaded: boolean
  center: MapCenter
  stations: StationData[]
  activeStation: number | null
  onMarkerClick: (stationId: number) => void
  onInfoWindowClose: () => void
}

const mapOptions = {
  styles: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#333333' }]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#f5f5f5' }]
    },
    {
      featureType: 'water',
      stylers: [{ color: '#a0d3ff' }]
    },
    {
      featureType: 'road',
      stylers: [{ color: '#e0e0e0' }]
    }
  ]
}

const getMarkerIcon = (color: 'green' | 'orange' | 'gray') => {
  const iconMap = {
    green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    orange: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    gray: 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png'
  }
  return iconMap[color]
}

/**
 * Component hiển thị Google Map với các marker trạm sạc
 */
export const MapSection: React.FC<MapSectionProps> = ({
  isLoaded,
  center,
  stations,
  activeStation,
  onMarkerClick,
  onInfoWindowClose
}) => {
  if (!isLoaded) {
    return (
      <div className='map-section'>
        <div>Đang tải bản đồ...</div>
      </div>
    )
  }

  const activeStationData = stations.find((s) => s.id === activeStation)

  return (
    <div className='map-section'>
      <GoogleMap center={center} zoom={11.5} options={mapOptions} mapContainerClassName='booking-map-container'>
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={{ lat: station.lat, lng: station.lng }}
            onClick={() => onMarkerClick(station.id)}
            icon={{ url: getMarkerIcon(station.color) }}
          />
        ))}

        {activeStation && activeStationData && (
          <StationInfoWindow station={activeStationData} onClose={onInfoWindowClose} />
        )}
      </GoogleMap>
    </div>
  )
}
