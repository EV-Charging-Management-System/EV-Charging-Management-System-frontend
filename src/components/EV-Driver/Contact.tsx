import React from 'react'
import '../../css/Contact.css'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layouts/header'
import Footer from '../../components/layouts/footer'
import MenuBar from '../../components/layouts/menu-bar'

const Contact: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='page-container'>
      <Header />

      <MenuBar />

      <main className='page-body'>
        <h1 className='page-title'>Liên Hệ Với Chúng Tôi</h1>
        <p className='page-description'>
          Hãy để lại phản hồi hoặc yêu cầu hỗ trợ, đội ngũ chăm sóc khách hàng luôn sẵn sàng phục vụ 24/7.
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
