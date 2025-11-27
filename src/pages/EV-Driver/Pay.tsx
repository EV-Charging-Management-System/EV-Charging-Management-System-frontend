import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../css/Pay.css'

const STORAGE_KEY = 'viTraSau'

type Transaction = {
  id: string
  date: string
  month: string
  station: string
  address?: string
  port?: string
  power?: string
  code?: string
  durationMinutes?: number
  kwh?: number
  amount: number
  paid: boolean
}

type ViTraSauData = {
  currentMonth: number
  transactions: Transaction[]
}

const loadViTraSau = (): ViTraSauData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { currentMonth: 0, transactions: [] }
    const parsed = JSON.parse(raw) as ViTraSauData
    return {
      currentMonth: typeof parsed.currentMonth === 'number' ? parsed.currentMonth : 0,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : []
    }
  } catch (e) {
    console.error('loadViTraSau error', e)
    return { currentMonth: 0, transactions: [] }
  }
}

const saveViTraSau = (data: ViTraSauData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const getMonthStr = (isoDate: string) => {
  const d = new Date(isoDate)
  const m = d.getMonth() + 1
  const y = d.getFullYear()
  return `${m.toString().padStart(2, '0')}/${y}`
}

const Pay: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    totalCost = 0,
    stationName = '',
    address = '',
    port = '',
    power = '',
    code = '',
    durationMinutes = 0,
    kwh = 0,
    startTime,
    endTime
  } = (location.state as any) || {}

  const handleConfirm = () => {
    // Create transaction
    const nowIso = new Date().toISOString()
    const tx: Transaction = {
      id: `txn_${Date.now()}`,
      date: nowIso,
      month: getMonthStr(nowIso),
      station: stationName || 'Charging Station',
      address,
      port,
      power,
      code,
      durationMinutes,
      kwh,
      amount: Number(totalCost || 0),
      paid: false
    }

    // Save to localStorage
    const data = loadViTraSau()
    data.transactions = data.transactions || []
    data.transactions.push(tx)
    data.currentMonth = (data.currentMonth || 0) + tx.amount
    saveViTraSau(data)

    alert('Transaction added to Pay Later Wallet (not paid yet).')

    // Navigate back to Booking Online Station
    navigate('/booking-online-station')
  }

  return (
    <div className='pay-container'>
      <div className='pay-card'>
        <h1>Pay Invoice</h1>
        <p className='desc'>Please confirm your payment method</p>

        <div className='method-box'>
          <h3>Payment Method</h3>
          <div className='method-item selected'>
            <span>💳 Pay Later Wallet</span>
          </div>
        </div>

        <div className='session-details'>
          <p>
            <strong>Station:</strong> {stationName}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Charge Code:</strong> {code}
          </p>
          <p>
            <strong>Duration:</strong> {durationMinutes} minutes
          </p>
          <p>
            <strong>Energy:</strong> {kwh} kWh
          </p>
          <p>
            <strong>Start Time:</strong> {startTime ? new Date(startTime).toLocaleString() : '-'}
          </p>
          <p>
            <strong>End Time:</strong> {endTime ? new Date(endTime).toLocaleString() : '-'}
          </p>
        </div>

        <div className='total-box'>
          <p>Total amount to be added to Pay Later Wallet (this month’s debt):</p>
          <h2>{Number(totalCost || 0).toLocaleString()} đ</h2>
        </div>

        <button className='confirm-btn' onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  )
}

export default Pay
