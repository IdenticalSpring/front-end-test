import React from "react";
import { Row, Col, Typography, Button, Card } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import football from "../../assets/images/6.png"
const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div style={{ padding: "40px", background: "#f5f5f5" }}>
      {/* Banner giới thiệu */}
      <div
        style={{
          backgroundImage: `url('https://source.unsplash.com/1600x600/?football')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          borderRadius: "8px",
          marginBottom: "40px",
        }}
      >
        <Title level={1} style={{ color: "#1890ff", textShadow: "2px 2px 4px #1890ff" }}>
          Chào mừng đến với Football Booking!
        </Title>
      </div>

      <Row gutter={[32, 32]}>
        {/* Giới thiệu */}
        <Col xs={24} md={12}>
          <Title level={2}>Về Chúng Tôi</Title>
          <Paragraph>
            Football Booking là nền tảng đặt sân bóng đá trực tuyến hàng đầu, giúp bạn tìm kiếm, đặt chỗ và thanh toán nhanh chóng.
            Với hệ thống đặt sân thông minh, bạn có thể kiểm tra tình trạng sân, so sánh giá cả và đặt lịch theo nhu cầu.
          </Paragraph>
          <Button type="primary" size="large">
            Đặt Sân Ngay
          </Button>
        </Col>

        {/* Hình ảnh giới thiệu */}
        <Col xs={24} md={12}>
          <img
            src={football}
            alt="Football Field"
            style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          />
        </Col>
      </Row>

      {/* Lợi ích của nền tảng */}
      <div style={{ marginTop: "60px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Tại Sao Chọn Chúng Tôi?
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: "center", padding: "20px" }}>
              <Title level={3}>Dễ dàng & Tiện lợi</Title>
              <Paragraph>Đặt sân chỉ với vài cú nhấp chuột, tiết kiệm thời gian và công sức.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: "center", padding: "20px" }}>
              <Title level={3}>Hệ thống đa dạng</Title>
              <Paragraph>Nhiều sân bóng trên khắp địa phương với mức giá cạnh tranh.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: "center", padding: "20px" }}>
              <Title level={3}>Thanh toán nhanh</Title>
              <Paragraph>Hỗ trợ nhiều phương thức thanh toán, bảo mật và an toàn.</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Thông tin liên hệ */}
      <div style={{ marginTop: "60px", textAlign: "center" }}>
        <Title level={2}>Liên Hệ Chúng Tôi</Title>
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable>
              <PhoneOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <Paragraph>Hotline: 0123 456 789</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <MailOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <Paragraph>Email: support@footballbooking.com</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <EnvironmentOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <Paragraph>Địa chỉ: 123 Đường ABC, Thành phố XYZ</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AboutUs;
