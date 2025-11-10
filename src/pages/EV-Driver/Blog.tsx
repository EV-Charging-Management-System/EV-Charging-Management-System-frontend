import React from "react";
import "../../css/Blog.css";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";

const Blog: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: "VinFast ra mắt loạt xe điện tại CES 2022",
      description:
        "VinFast chính thức giới thiệu dải sản phẩm xe điện VF5, VF6, VF7, VF8, VF9 tại CES 2022 cùng nhiều chính sách ưu đãi đặt cọc hấp dẫn.",
      image:
        "https://kenh14cdn.com/203336854389633024/2022/1/7/loat-xe-dien-vinfast-ra-mat-tai-ces-2022-gia-ban-va-chinh-sach-dat-coc-hap-dan-danvietvn-4-16414384301251621413589-16415367450621803239908.jpg",
      date: "07/01/2022",
    },
    {
      id: 2,
      title: "Công nghệ pin mới tăng quãng đường di chuyển 40%",
      description:
        "Các hãng xe đang đua nhau đầu tư vào công nghệ pin lithium thế hệ mới giúp xe điện hiệu quả hơn và sạc nhanh hơn.",
      image:
        "https://storage.googleapis.com/vinfast-data-01/cong-nghe-pin_1640916776.jpg",
      date: "01/11/2025",
    },
    {
      id: 3,
      title: "Trạm sạc xe điện Siemens tại Việt Nam",
      description:
        "Hệ thống trạm sạc nhanh Siemens giúp rút ngắn thời gian sạc xe điện, hướng tới mạng lưới năng lượng sạch và hiện đại.",
      image:
        "https://photo2.tinhte.vn/data/attachment-files/2023/04/6394813_evs_tram_sac_xe_dien_siemens_viet_nam.jpg",
      date: "25/10/2025",
    },
  ];

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      {/* ===== BODY ===== */}
      <main className="blog-body">
        <h1 className="page-title">Tin Tức & Blog Nổi Bật</h1>
        <p className="page-description">
          Cập nhật những thông tin mới nhất về trạm sạc, công nghệ năng lượng
          xanh và xu hướng ô tô điện.
        </p>

        {/* 🔥 BÀI VIẾT NỔI BẬT */}
        <div className="featured-post">
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            className="featured-image"
          />
          <div className="featured-content">
            <h2>{featuredPost.title}</h2>
            <p className="featured-date">{featuredPost.date}</p>
            <p className="featured-desc">{featuredPost.description}</p>
            <button className="read-more">Đọc thêm</button>
          </div>
        </div>

        {/* 📰 CÁC BÀI VIẾT KHÁC */}
        <div className="blog-grid">
          {otherPosts.map((post) => (
            <div className="blog-card" key={post.id}>
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-content">
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-date">{post.date}</p>
                <p className="blog-desc">{post.description}</p>
                <button className="read-more">Đọc thêm</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
