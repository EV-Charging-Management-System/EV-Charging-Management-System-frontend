import React from 'react'
import type { BookingFormData, Port, Vehicle } from './types'

interface BookingFormProps {
  formData: BookingFormData
  ports: Port[]
  vehicles: Vehicle[]
  selectedPortId: number | null
  payLoading: boolean
  vehiclesLoading?: boolean
  onFormDataChange: (data: Partial<BookingFormData>) => void
  onPortChange: (portId: number) => void
  onSubmit: (e: React.FormEvent) => void
}

export const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  ports,
  vehicles,
  selectedPortId,
  payLoading,
  vehiclesLoading,
  onFormDataChange,
  onPortChange,
  onSubmit
}) => {
  return (
    <div className='form-section'>
      <form className='booking-form' onSubmit={onSubmit}>
        <h2>Booking Schedule</h2>

        <label>Full Name</label>
        <input type='text' value={formData.name} readOnly />

        <label>Email</label>
        <input type='email' value={formData.email} readOnly />

        <label>Vehicle Brand</label>
        <select
          value={formData.vehicleId}
          onChange={(e) => {
            const selectedVehicle = vehicles.find((v) => v.VehicleId === Number(e.target.value))
            onFormDataChange({
              vehicleId: e.target.value,
              carBrand: selectedVehicle?.VehicleName || ''
            })
          }}
          required
          disabled={vehiclesLoading}
        >
          <option value=''>
            {vehiclesLoading ? 'Loading...' : vehicles.length === 0 ? 'No vehicles' : 'Select vehicle brand'}
          </option>

          {vehicles.map((vehicle) => (
            <option key={vehicle.VehicleId} value={vehicle.VehicleId}>
              {vehicle.VehicleName} ({vehicle.LicensePlate})
            </option>
          ))}
        </select>

        <label>Charging Port</label>
        <select
          value={selectedPortId ?? ''}
          onChange={(e) => onPortChange(Number(e.target.value))}
          required
        >
          <option value=''>Select port</option>
          {ports.map((pt: Port) => (
            <option key={pt.PortId} value={pt.PortId}>
              {pt.PortType} (Port {pt.PortId})
            </option>
          ))}
        </select>

        {/* PRICE BOX */}
        <div className='price-box'>
          <label>Deposit for 3h charging</label>
          <div className='price'>30,000 ₫</div>
        </div>

        <div className='form-buttons'>
          <button type='submit' className='submit-btn' disabled={payLoading}>
            {payLoading ? 'Processing...' : 'Payment'}
          </button>
        </div>
      </form>
    </div>
  )
}