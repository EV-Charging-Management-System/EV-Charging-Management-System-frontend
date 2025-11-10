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

/**
 * Component form đặt lịch sạc
 */
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
              {vehicle.VehicleName} - {vehicle.VehicleType} ({vehicle.LicensePlate})
            </option>
          ))}
        </select>

        <label>Giờ đến sạc</label>
        <input
          type='time'
          value={formData.time}
          onChange={(e) => onFormDataChange({ time: e.target.value })}
          required
        />

        <label>Cổng sạc</label>
        <select value={selectedPortId ?? ''} onChange={(e) => onPortChange(Number(e.target.value))} required>
          <option value=''>Chọn port</option>
          {ports.map((pt: Port) => {
            const id = pt.PortId ?? pt.PortId
            const type = pt.PortType ?? pt.PortType
            return (
              <option key={id} value={id}>
                {type ? `${type} (Port ${id})` : `Port ${id}`}
              </option>
            )
          })}
        </select>

        <div
          style={{
            margin: '20px 0',
            padding: '15px',
            backgroundColor: '#878c8fff',
            border: '2px solid #202020ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          <label
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e40af',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Giá đặt cọc
          </label>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#e4e6ecff'
            }}
          >
            30,000 ₫
          </div>
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
