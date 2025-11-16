import { useState, useEffect } from 'react';
import locationService from '../../../services/locationService';
import type { StaffAddress } from './types';

const defaultCenter = { lat: 10.7765, lng: 106.7009 };

export const useStations = () => {
  const [stations, setStations] = useState<StaffAddress[]>([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await locationService.getStaffAddress();
        const stationsArray = Array.isArray(data) ? data : [];

        const mappedWithFallback = (stationsArray ?? []).map((station, idx) => ({
          ...station,
          lat: station.lat ?? (10.776 + (idx % 10) * 0.002),
          lng: station.lng ?? (106.700 + Math.floor(idx / 10) * 0.002)
        }));

        setStations(mappedWithFallback);
        setFetchError(null);
      } catch (error) {
        setFetchError((error as any)?.message || 'Lỗi tải dữ liệu trạm');
      }
    };
    fetchStations();
  }, []);

  const handleStationSelect = (stationId: number | null) => {
    setSelectedStationId(stationId);
    if (stationId === null) {
      setMapCenter(defaultCenter);
      return;
    }
    const station = stations.find((s) => s.StationId === stationId);
    if (station) {
      setMapCenter({ 
        lat: station.lat ?? defaultCenter.lat, 
        lng: station.lng ?? defaultCenter.lng 
      });
    }
  };

  return {
    stations,
    mapCenter,
    activeMarker,
    selectedStationId,
    fetchError,
    setActiveMarker,
    handleStationSelect,
  };
};
