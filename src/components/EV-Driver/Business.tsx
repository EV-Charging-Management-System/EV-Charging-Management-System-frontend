import React from 'react'
import '../../css/Business.css'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layouts/header'
import Footer from '../../components/layouts/footer'
import MenuBar from '../../components/layouts/menu-bar'

const Business: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='page-container'>
      <Header />

      <MenuBar />

      <main className='page-body'>
        <h1 className='page-title'>Hợp Tác Kinh Doanh</h1>
        <p className='page-description'>
          Mở rộng hệ thống trạm sạc của bạn cùng chúng tôi – giải pháp năng lượng xanh cho tương lai.
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default Business
