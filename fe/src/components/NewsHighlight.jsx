import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { getBlogs } from "../services/api"; // Hàm gọi API lấy blogs
import { useNavigate } from "react-router-dom"; // <-- dùng navigate để chuyển trang

const NewsHighlight = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs(); // Gọi API lấy danh sách bài viết
        const sortedBlogs = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo ngày giảm dần
        setBlogs(sortedBlogs.slice(0, 3)); // Chỉ lấy 3 bài viết mới nhất
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []); // Chỉ gọi một lần khi component được mount
  const handleViewDetail = (id) => {
    navigate(`/blogs/${id}`); // <-- chuyển qua trang chi tiết blog
  };
  return (
    <div className="news-highlight">
      <h2 className="section-title">Tin Tức Nổi Bật</h2>
      {loading ? (
        <div>Đang tải...</div> // Thông báo khi đang tải dữ liệu
      ) : (
        <Row gutter={[16, 16]}>
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <Col  key={blog.id} xs={24} sm={12} md={8} lg={8}>
                <Card onClick={() => handleViewDetail(blog.id)} // Thêm sự kiện click để xem chi tiết
                  hoverable
                  cover={
                    <img
                      alt={blog.title}
                      src={blog.image || "default-image.jpg"} // Sử dụng ảnh mặc định nếu không có ảnh
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "200px",
                      }}
                    />
                  }
                >
                  <Card.Meta
                    title={blog.title}
                    description={
                      <>
                      
                        <p>
                          <strong>{new Date(blog.createdAt).toLocaleDateString()}</strong>
                        </p>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))
          ) : (
            <div>Không có bài viết nào</div> // Thông báo nếu không có dữ liệu
          )}
        </Row>
      )}
    </div>
  );
};

export default NewsHighlight;
