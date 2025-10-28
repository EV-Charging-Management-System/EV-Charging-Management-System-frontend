import React, { useState } from 'react'
import '../../css/BookingDetail.css'
import { FaBolt, FaCheckCircle } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'
import mapImage from "../../assets/mapdetailbook.jpg";
import bookingService from '../../services/bookingService';
const BookingDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const stationId = Number(id)

  // Danh sách trạm
  const stationList = [
    { id: 1, name: 'Trạm Sạc Trung Tâm Quận 1' },
    { id: 2, name: 'Trạm Sạc Phú Mỹ Hưng' },
    { id: 3, name: 'Trạm Sạc Thủ Đức' }
  ]

  // Danh sách cổng sạc
  const stations = [
    { id: 1, port: 'Cổng M', power: '80 kW', status: 'available' },
    { id: 2, port: 'Cổng N', power: '110 kW', status: 'booked' },
    { id: 3, port: 'Cổng D', power: '150 kW', status: 'available' },
    { id: 4, port: 'Cổng M', power: '80 kW', status: 'maintenance' },
    { id: 5, port: 'Cổng N', power: '110 kW', status: 'available' },
    { id: 6, port: 'Cổng D', power: '150 kW', status: 'booked' }
  ]

  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const [bookingCode, setBookingCode] = useState<string>('')

  const [paymentForm, setPaymentForm] = useState({
    amount: '30000',
    orderInfo: ''
  })
  const [payLoading, setPayLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: 'Jos Nguyễn',
    userId: 'SE182928',
    email: 'phucsms@gmail.com',
    carBrand: '',
    date: '',
    time: ''
  })

  const currentStation = stationList.find((s) => s.id === stationId)?.name || 'Không xác định'

  const today = new Date()
  const minDate = today.toISOString().split('T')[0]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Xử lý đặt lịch
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStation) return alert('Vui lòng chọn một cổng sạc!')
    if (!formData.date) return alert('Vui lòng chọn ngày đến sạc!')
    setShowQR(true)
  }

  // Quay lại form đặt lịch
  const handleBackToForm = () => {
    setShowQR(false)
    setPaymentDone(false)
  }

  // Khi ấn "Đã Thanh Toán"
  const handlePaymentSuccess = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Require minimal payment fields
    if (!paymentForm.amount) {
      return alert('Vui lòng nhập amount.');
    }
    // Call backend to create VNPAY URL and redirect
    (async () => {
      try {
        setPayLoading(true)
        const url = await bookingService.createVnPay({ amount: paymentForm.amount, orderInfo: paymentForm.orderInfo })
        if (url) {
          // redirect to payment gateway
          window.location.href = url
          return
        }

        // fallback: mark as paid locally
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()
        setBookingCode(code)
        setPaymentDone(true)
      } catch (err: any) {
        console.error('Payment creation failed', err)
        alert(err?.message || 'Không thể tạo URL thanh toán')
      } finally {
        setPayLoading(false)
      }
    })()
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value })
  }

  return (
    <div className='booking-container'>
      <Header />
      <MenuBar />
      {/* ===== BODY ===== */}
      <main className='booking-detail-body'>
        <div className='detail-layout'>
          {/* ==== BẢN ĐỒ ==== */}
          <div className='map-detail'>
            <img src={mapImage} alt="map" className="map-image" />
          </div>

          {/* ==== FORM / QR / THÔNG BÁO ==== */}
          <div className='form-section'>
            {!selectedStation ? (
              <div className='empty-form'>
                <FaBolt className='empty-icon' />
                <p>Chọn một cổng sạc để bắt đầu đặt lịch</p>
              </div>
            ) : paymentDone ? (
              // ✅ GIAO DIỆN SAU THANH TOÁN THÀNH CÔNG
              <div className='payment-success'>
                <FaCheckCircle className='success-icon' />
                <h2>Đặt Lịch Thành Công!</h2>
                <p>Mã sạc của bạn</p>
                <div className='booking-code'>{bookingCode}</div>

                <div className='success-info'>
                  <p>
                    <strong>Trạm:</strong> {currentStation}
                  </p>
                  <p>
                    <strong>Cổng:</strong> {stations[selectedStation - 1]?.port} –{' '}
                    {stations[selectedStation - 1]?.power}
                  </p>
                  {/* no transfer details shown per requirement */}
                  {paymentForm.amount && (
                    <div className='invoice-summary'>
                      <p><strong>Amount:</strong> {paymentForm.amount}</p>
                      {paymentForm.orderInfo && <p><strong>Order info:</strong> {paymentForm.orderInfo}</p>}
                    </div>
                  )}
                  <p>
                    <strong>Thời gian:</strong> {formData.date ? `${formData.date} ${formData.time}` : 'Không xác định'}
                  </p>
                  <div className='success-message'>
                    Vui lòng đến đúng giờ và sử dụng mã sạc để bắt đầu.
                    <br />
                    Mã sạc đã được gửi qua email.
                  </div>
                </div>

                <div className='form-buttons'>
                  <button className='cancel-btn' onClick={handleBackToForm}>
                    Quay Lại
                  </button>
                  <button className='submit-btn' onClick={() => navigate('/booking-online-station')}>
                    Xem Lịch Đặt
                  </button>
                </div>
              </div>
            ) : showQR ? (
              // ✅ PAYMENT FORM (replaces QR flow)
              <div className='payment-form-section'>
                <h2>Thanh Toán Giữ Chỗ</h2>

                <form className='payment-form' onSubmit={handlePaymentSuccess}>
                  <label>Amount</label>
                  <input type='number' name='amount' value={paymentForm.amount} onChange={handlePaymentChange} required />

                  <label>Order Info</label>
                  <input type='text' name='orderInfo' value={paymentForm.orderInfo} onChange={handlePaymentChange} />

                  <div className='form-buttons'>
                    <button type='button' className='cancel-btn' onClick={handleBackToForm}>
                      Quay Lại
                    </button>
                    <button type='submit' className='submit-btn' disabled={payLoading}>
                      {payLoading ? 'Đang chuyển...' : 'Thanh Toán'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // ✅ FORM ĐẶT LỊCH
              <form className='booking-form' onSubmit={handleSubmit}>
                <h2>Đặt Lịch Sạc</h2>
                <p className='station-info'>
                  {currentStation} – {stations[selectedStation - 1]?.port || 'Cổng không xác định'}
                </p>

                <label>Họ và tên</label>
                <input type='text' name='name' value={formData.name} onChange={handleChange} required />

                <label>ID</label>
                <input type='text' name='userId' value={formData.userId} onChange={handleChange} required />

                <label>Email</label>
                <input type='email' name='email' value={formData.email} onChange={handleChange} required />

                <label>Hãng xe</label>
                <select name='carBrand' value={formData.carBrand} onChange={handleChange} required>
                  <option value=''>Chọn hãng xe</option>
                  <option>VinFast</option>
                  <option>Hyundai</option>
                  <option>Tesla</option>
                </select>

                <label>Trụ sạc</label>
                <input type='text' value={selectedStation ? `Trụ ${selectedStation}` : ''} readOnly />

                <div className='form-inline'>
                  <div>
                    <label>Cổng sạc</label>
                    <input type='text' value={stations[selectedStation - 1]?.port || ''} readOnly />
                  </div>
                  <div>
                    <label>Công suất</label>
                    <input type='text' value={stations[selectedStation - 1]?.power || ''} readOnly />
                  </div>
                </div>

                <label>Ngày đến sạc</label>
                <input type='date' name='date' min={minDate} value={formData.date} onChange={handleChange} required />

                <label>Giờ đến sạc</label>
                <input type='time' name='time' value={formData.time} onChange={handleChange} required />

                <div className='form-buttons'>
                  <button type='button' className='cancel-btn' onClick={() => setSelectedStation(null)}>
                    Hủy
                  </button>
                  <button type='submit' className='submit-btn'>
                     Tiếp tục
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ==== DANH SÁCH CỔNG SẠC ==== */}
        <section className='station-grid'>
          <h3>Chọn Cổng Sạc</h3>
          <p>Chọn ô còn trống (màu trắng) để đặt lịch</p>

          <div className='grid-container'>
            {stations.map((s) => (
              <div
                key={s.id}
                className={`station-box ${s.status} ${selectedStation === s.id ? 'active' : ''}`}
                onClick={() => (s.status === 'available' ? setSelectedStation(s.id) : null)}
              >
                <h4>#{s.id}</h4>
                <span className='port'>{s.port}</span>
                <p>{s.power}</p>
                <p className='status-text'>
                  {s.status === 'available' ? 'Còn trống' : s.status === 'booked' ? 'Đã đặt' : 'Bảo trì'}
                </p>
              </div>
            ))}
          </div>
                  {selectedStation && (
                    <p>
                      <strong>Trụ:</strong> #{stations[selectedStation - 1]?.id}
                    </p>
                  )}

          <div className='legend'>
            <span className='legend-item available'>Còn trống</span>
            <span className='legend-item booked'>Đã đặt</span>
            <span className='legend-item maintenance'>Bảo trì</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default BookingDetail
