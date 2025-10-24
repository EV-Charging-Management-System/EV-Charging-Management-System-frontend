import React, { useEffect, useState } from 'react'
import '../../css/Invoice.css'
import ProfileStaff from '../../Customhooks/ProfileStaff'
import { useNavigate } from 'react-router-dom'
import StaffSideBar from '../../components/layouts/staffSidebar'

interface InvoiceData {
  sessionId: number
  customer: string
  phone: string
  carBrand: string
  startTime: string
  endTime: string
  cost: number
  stationName: string
  chargerName: string
  power: string
  method?: string
  date?: string
}

const Invoice: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [history, setHistory] = useState<InvoiceData[]>([])
  const [selected, setSelected] = useState<InvoiceData | null>(null)
  const [method, setMethod] = useState<string>('')
  const [paid, setPaid] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const storedInvoice = localStorage.getItem('currentInvoice')
    if (storedInvoice) {
      try {
        const parsed: InvoiceData = JSON.parse(storedInvoice)
        parsed.startTime = new Date(parsed.startTime).toLocaleString('vi-VN')
        parsed.endTime = new Date(parsed.endTime).toLocaleString('vi-VN')
        setInvoice(parsed)
      } catch {
        setInvoice(null)
      }
    }

    const savedHistory = localStorage.getItem('invoiceHistory')
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  const handlePayment = () => {
    if (!invoice || !method) return

    const newInvoice: InvoiceData = {
      ...invoice,
      method,
      date: new Date().toLocaleString('vi-VN')
    }

    const updatedHistory = [...history, newInvoice]
    setHistory(updatedHistory)
    setPaid(true)
    localStorage.setItem('invoiceHistory', JSON.stringify(updatedHistory))
    localStorage.removeItem('currentInvoice')
  }

  return (
    <div className='charging-wrapper'>
      <StaffSideBar />

      {/* ==== MAIN CONTENT ==== */}
      <div className='charging-main-wrapper fade-in'>
        <header className='charging-header'>
          <h1>Hóa đơn sạc xe</h1>
          <div className='charging-header-actions'>
            <ProfileStaff />
          </div>
        </header>

        <main className='invoice-body'>
          <div className='invoice-container'>
            {/* ==== CÓ HÓA ĐƠN HIỆN TẠI ==== */}
            {invoice ? (
              <>
                <h2>Hóa đơn tháng {new Date().getMonth() + 1}</h2>

                <div className='invoice-box'>
                  <h3>🚗 Trạm {invoice.stationName}</h3>
                  <p>
                    Cổng: <strong>{invoice.chargerName}</strong>
                  </p>
                  <p>
                    Khách hàng: <strong>{invoice.customer}</strong>
                  </p>
                  <p>
                    SĐT: <strong>{invoice.phone}</strong>
                  </p>
                  <p>
                    Xe: <strong>{invoice.carBrand}</strong> – {invoice.power}
                  </p>
                  <p>
                    Bắt đầu: <strong>{invoice.startTime}</strong>
                  </p>
                  <p>
                    Kết thúc: <strong>{invoice.endTime}</strong>
                  </p>
                  <p>
                    Tổng tiền: <strong className='price-text'>{invoice.cost.toLocaleString()}đ</strong>
                  </p>
                </div>

                {/* ==== THANH TOÁN ==== */}
                {!paid ? (
                  <>
                    <h3 className='choose-method-title'>Chọn phương thức thanh toán</h3>
                    <div className='payment-methods'>
                      {['Tiền mặt', 'Chuyển khoản', 'Business'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setMethod(opt)}
                          className={`pm-btn ${method === opt ? 'active' : ''}`}
                        >
                          {opt === 'Tiền mặt'
                            ? '💵 Tiền mặt'
                            : opt === 'Chuyển khoản'
                              ? '🏦 Chuyển khoản'
                              : '🧾 Business'}
                        </button>
                      ))}
                    </div>

                    {method === 'Chuyển khoản' && (
                      <div className='qr-box'>
                        <img src='/QR1.png' alt='QR Thanh toán' />
                        <p>
                          Số tiền: <strong>{invoice.cost.toLocaleString()}đ</strong>
                        </p>
                      </div>
                    )}

                    <button className='confirm-btn' onClick={handlePayment} disabled={!method}>
                      ✅ Xác nhận và In Hóa Đơn
                    </button>
                  </>
                ) : (
                  <div className='payment-success'>
                    <p>✅ Thanh toán hoàn tất!</p>
                    <button onClick={() => navigate('/staff/sessions')}>🔙 Quay lại phiên sạc</button>
                  </div>
                )}
              </>
            ) : (
              /* ==== LỊCH SỬ GIAO DỊCH ==== */
              <>
                <h2>📜 Lịch sử giao dịch</h2>
                {history.length > 0 ? (
                  history.map((item, i) => (
                    <div className='history-item' key={i}>
                      <div className='history-summary'>
                        <div>
                          <p>
                            <strong>{item.customer}</strong> – <span>({item.stationName})</span>
                          </p>
                          <p>
                            Số tiền: <strong>{item.cost.toLocaleString()}đ</strong>
                          </p>
                          <p>
                            Phương thức: <strong>{item.method || '-'}</strong>
                          </p>
                        </div>
                        <button className='detail-btn' onClick={() => setSelected(item)}>
                          👁️ Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Chưa có lịch sử giao dịch nào.</p>
                )}
              </>
            )}
          </div>
        </main>

        <footer className='footer'>© 2025 EV Charging System — All rights reserved.</footer>
      </div>

      {/* ==== MODAL CHI TIẾT ==== */}
      {selected && (
        <div className='modal-overlay' onClick={() => setSelected(null)}>
          <div className='modal-card' onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết hóa đơn</h3>
            <div className='modal-body'>
              {Object.entries(selected).map(([key, value]) =>
                key !== 'sessionId' ? (
                  <p key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </p>
                ) : null
              )}
            </div>
            <div className='modal-actions'>
              <button onClick={() => setSelected(null)}>✖ Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoice
