import React from "react";
import "../../css/Blog.css";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";

const Blog: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: "VinFast launches electric vehicles at CES 2022",
      description:
        "VinFast officially introduces the VF5, VF6, VF7, VF8, VF9 electric vehicle lineup at CES 2022 with attractive pre-order policies.",
      image:
        "https://kenh14cdn.com/203336854389633024/2022/1/7/loat-xe-dien-vinfast-ra-mat-tai-ces-2022-gia-ban-va-chinh-sach-dat-coc-hap-dan-danvietvn-4-16414384301251621413589-16415367450621803239908.jpg",
      date: "07/01/2022",
    },
    {
      id: 2,
      title: "New battery technology increases range by 40%",
      description:
        "Automakers are competing to invest in new generation lithium battery technology to make electric vehicles more efficient and charge faster.",
      image:
        "https://storage.googleapis.com/vinfast-data-01/cong-nghe-pin_1640916776.jpg",
      date: "01/11/2025",
    },
    {
      id: 3,
      title: "Siemens electric vehicle charging station in Vietnam",
      description:
        "Siemens fast charging system helps shorten electric vehicle charging time, towards a clean and modern energy network.",
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
        <h1 className="page-title">Featured News & Blog</h1>
        <p className="page-description">
          Get the latest information about charging stations, energy technology
          and electric vehicle trends.
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
            <button className="read-more">Read More</button>
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
                <button className="read-more">Read More</button>
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
