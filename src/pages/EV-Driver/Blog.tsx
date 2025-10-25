import React from 'react'
import '../../css/Blog.css'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'
const Blog: React.FC = () => {
  return (
    <div className='page-container'>
      <Header />
      <MenuBar />
      {/* ===== BODY ===== */}
      <main className='page-body'>
        <h1 className='page-title'>Tin Tức & Blog Nổi Bật</h1>
        <p className='page-description'>
          Cập nhật những thông tin mới nhất về trạm sạc, công nghệ năng lượng xanh và xu hướng ô tô điện.
        </p>
      </main>
      <Footer />
    </div>
  )
}

export default Blog
