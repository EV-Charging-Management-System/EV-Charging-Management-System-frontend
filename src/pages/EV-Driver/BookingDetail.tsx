import React, { useState } from 'react'
import '../../css/BookingDetail.css'
import { FaBolt, FaCheckCircle } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'
import mapImage from "../../assets/mapdetailbook.jpg";
import QRImage from "../../assets/QR1.png";
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

  const [formData, setFormData] = useState({
    name: 'Jos Nguyễn',
    userId: 'SE182928',
    phone: '02840375032',
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
  const handlePaymentSuccess = () => {
    // Random mã đặt chỗ
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setBookingCode(code)
    setPaymentDone(true)
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
              // ✅ GIAO DIỆN QR
              <div className='qr-section'>
                <h2>Thanh Toán Giữ Chỗ</h2>
                <p>Vui lòng quét mã QR để thanh toán phí giữ chỗ 80.000đ</p>

                <div className='qr-box'>
                  <img src={QRImage} alt="QR Thanh Toán" className="qr-image" />
                </div>

                <div className='qr-info'>
                  <p>
                    <strong>Phí giữ chỗ:</strong> 80.000đ
                  </p>
                  <p>
                    <strong>Ngân hàng:</strong> Vietcombank
                  </p>
                  <p>
                    <strong>STK:</strong> 11243782
                  </p>
                  <p>
                    <strong>Nội dung:</strong> Booking {formData.name}
                  </p>
                </div>

                <div className='form-buttons'>
                  <button className='cancel-btn' onClick={handleBackToForm}>
                    Quay Lại
                  </button>
                  <button className='submit-btn' onClick={handlePaymentSuccess}>
                    Đã Thanh Toán
                  </button>
                </div>
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

                <label>Số điện thoại</label>
                <input type='text' name='phone' value={formData.phone} onChange={handleChange} required />

                <label>Email</label>
                <input type='email' name='email' value={formData.email} onChange={handleChange} required />

                <label>Hãng xe</label>
                <select name='carBrand' value={formData.carBrand} onChange={handleChange} required>
                  <option value=''>Chọn hãng xe</option>
                  <option>VinFast</option>
                  <option>Hyundai</option>
                  <option>Tesla</option>
                </select>

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
                    Tiếp Tục
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
