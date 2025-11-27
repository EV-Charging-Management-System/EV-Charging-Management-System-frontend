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
        <h2>Đặt Lịch Sạc</h2>

        <label>Họ và tên</label>
        <input type='text' value={formData.name} readOnly />

        <label>Email</label>
        <input type='email' value={formData.email} readOnly />

        <label>Hãng xe</label>
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
            {vehiclesLoading ? 'Đang tải...' : vehicles.length === 0 ? 'Không có xe nào' : 'Chọn hãng xe'}
          </option>

          {vehicles.map((vehicle) => (
            <option key={vehicle.VehicleId} value={vehicle.VehicleId}>
              {vehicle.VehicleName} ({vehicle.LicensePlate})
            </option>
          ))}
        </select>

        <label>Cổng sạc</label>
        <select
          value={selectedPortId ?? ''}
          onChange={(e) => onPortChange(Number(e.target.value))}
          required
        >
          <option value=''>Chọn port</option>
          {ports.map((pt: Port) => (
            <option key={pt.PortId} value={pt.PortId}>
              {pt.PortType} (Port {pt.PortId})
            </option>
          ))}
        </select>

        {/* PRICE BOX */}
        <div className='price-box'>
          <label>Giá đặt cọc cho 3h sạc</label>
          <div className='price'>30,000 ₫</div>
        </div>

        <div className='form-buttons'>
          <button type='submit' className='submit-btn' disabled={payLoading}>
            {payLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </button>
        </div>
      </form>
    </div>
  )
}