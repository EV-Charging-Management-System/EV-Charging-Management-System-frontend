import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import locationService from '../../../services/locationService';
import chargingPointService from '../../../services/chargingPointService';
import { vehicleService } from '../../../services/vehicleService';
import type { Station, ChargingPoint, ChargingPort, BookingFormData } from './types';

const API_BASE_URL = "http://localhost:5000/api/charging-session";

export const useLocationDetail = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const decodedAddress = decodeURIComponent(address || "");

  const [fadeIn, setFadeIn] = useState(false);
  const [station, setStation] = useState<Station | null>(null);
  const [chargers, setChargers] = useState<ChargingPoint[]>([]);
  const [ports, setPorts] = useState<ChargingPort[]>([]);
  const [selectedCharger, setSelectedCharger] = useState<ChargingPoint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState<"EV-Driver" | "Guest">("EV-Driver");

  const [form, setForm] = useState<BookingFormData>({
    licensePlate: "",
    displayName: "",
    battery: "",
    portId: "",
    portType: "",
    kwh: "",
    price: "",
    userId: "",
  });

  const [loadingStation, setLoadingStation] = useState(false);
  const [loadingChargers, setLoadingChargers] = useState(false);
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fade in effect
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Load station info
  useEffect(() => {
    if (!decodedAddress) return;
    setLoadingStation(true);
    (async () => {
      try {
        const res = await locationService.getStationInfo(decodedAddress);
        setStation(res);
      } catch {
        alert("⚠️ Error fetching station information");
      } finally {
        setLoadingStation(false);
      }
    })();
  }, [decodedAddress]);

  // Load charging points
  useEffect(() => {
    if (!station?.StationId) return;

    setLoadingChargers(true);
    (async () => {
      try {
        const list = await chargingPointService.getByStationId(station.StationId);
        setChargers(list);
      } catch {
        alert("⚠️ Error fetching charging points list");
      } finally {
        setLoadingChargers(false);
      }
    })();
  }, [station]);

  // Reset userType when form opens
  useEffect(() => {
    if (showForm) {
      setUserType("EV-Driver");
    }
  }, [showForm]);

  const openForm = async (charger: ChargingPoint) => {
    if (charger.ChargingPointStatus?.toLowerCase() !== "available") {
      return alert("⚠️ Charging point is busy!");
    }

    setSelectedCharger(charger);
    setShowForm(true);

    // Reset form
    setForm({
      licensePlate: "",
      displayName: "",
      battery: "",
      portId: "",
      portType: "",
      kwh: "",
      price: "",
      userId: "",
    });

    // Load ports
    setLoadingPorts(true);
    try {
      const portsList = await chargingPointService.getPortsByPoint(charger.PointId);
      setPorts(Array.isArray(portsList) ? portsList : []);
    } catch {
      alert("⚠️ Error fetching charging ports");
      setPorts([]);
    } finally {
      setLoadingPorts(false);
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      licensePlate: e.target.value,
      displayName: "",
      battery: "",
    }));
  };

  const handleLookupCompany = async () => {
    const plate = form.licensePlate.trim();
    if (!plate) return alert("⚠️ Enter license plate!");

    try {
      const v = await vehicleService.getVehicleByLicensePlate(plate);

      if (!v || !v.userId) {
        setForm(prev => ({
          ...prev,
          displayName: "",
          battery: "",
          userId: "",
        }));
        return alert("⚠️ Vehicle not registered. Please enter battery % manually!");
      }

      let display = `UserId: ${v.userId} - Vehicle: ${v.licensePlate}`;

      if (v.companyName) display = `Company: ${v.companyName} - UserId: ${v.userId}`;
      if (v.userName) display = `Customer: ${v.userName} - UserId: ${v.userId}`;

      if (v.battery) display += ` - Battery: ${v.battery}`;

      setForm(prev => ({
        ...prev,
        displayName: display,
        battery: v.battery ? String(v.battery) : "",
        userId: v.userId ? String(v.userId) : "",
      }));

      alert("✅ Lookup successful!");
    } catch (error: any) {
      alert(`⚠️ Lookup error: ${error.message || error}`);
    }
  };

  const createChargingSession = async (
    licensePlate: string,
    stationId: number,
    pointId: number,
    portId: number,
    battery: number,
    userId?: string
  ) => {
    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Session expired!");

      const body: any = {
        licensePlate,
        stationId,
        pointId,
        portId,
        batteryPercentage: battery,
      };

      if (userId) body.userId = Number(userId);

      const res = await fetch(`${API_BASE_URL}/staff/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const sessionId = data.data?.sessionId;
      if (sessionId && userId) {
        localStorage.setItem(`session_${sessionId}_userId`, userId);
      }

      return data;
    } finally {
      setLoadingSubmit(false);
    }
  };

  const createChargingSessionGuest = async (
    stationId: number,
    pointId: number,
    portId: number,
    battery: number
  ) => {
    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Session expired!");

      const res = await fetch(`${API_BASE_URL}/guest/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stationId,
          pointId,
          portId,
          battery,
          batteryPercentage: battery,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCharger || !form.portId)
      return alert("⚠️ Select charging port first!");

    try {
      if (userType === "EV-Driver") {
        if (!form.licensePlate) return alert("⚠️ Enter license plate!");

        await createChargingSession(
          form.licensePlate,
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0,
          form.userId
        );

        alert("✅ EV-Driver charging session created successfully!");
      } else {
        await createChargingSessionGuest(
          station!.StationId,
          selectedCharger.PointId,
          Number(form.portId),
          0
        );

        alert("✅ Guest charging session created successfully!");
      }

      setShowForm(false);
      navigate("/staff/charging-process");
    } catch (err: any) {
      alert(`⚠️ Error creating charging session: ${err.message}`);
    }
  };

  const handlePortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const portId = Number(e.target.value);
    const port = ports.find(p => p.PortId === portId);

    if (!port) {
      setForm(prev => ({ ...prev, portId: "", portType: "", kwh: "", price: "" }));
      return;
    }

    setForm(prev => ({
      ...prev,
      portId: String(port.PortId),
      portType: port.PortType,
      kwh: String(port.PortTypeOfKwh),
      price: String(port.PortTypePrice),
    }));
  };

  return {
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
  };
};
