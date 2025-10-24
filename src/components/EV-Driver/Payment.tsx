import React from 'react'
import '../../css/Payment.css'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layouts/header'
import Footer from '../../components/layouts/footer'
import MenuBar from '../../components/layouts/menu-bar'

const Payment: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='page-container'>
      <Header />

      <MenuBar />

      <main className='page-body'>
        <h1 className='page-title'>Phương Thức Thanh Toán</h1>
        <p className='page-description'>Lựa chọn phương thức thanh toán tiện lợi và an toàn cho mỗi lần sạc của bạn.</p>
      </main>

      <Footer />
    </div>
  )
}

export default Payment
