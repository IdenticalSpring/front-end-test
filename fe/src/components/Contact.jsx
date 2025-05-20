import React from "react";
import { Row, Col, Typography, Input, Button, Form, Card } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { createContact } from "../services/api"; // đường dẫn điều chỉnh theo cấu trúc dự án
import { message } from "antd";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;


const Contact = () => {
 
  const [form] = Form.useForm(); // tạo instance form

  const onFinish = async (values) => {
    try {
      const res = await createContact(values);
      console.log("Liên hệ đã gửi thành công:", res.data);
      message.success("Gửi liên hệ thành công!");
      form.resetFields(); // reset form sau khi gửi
    } catch (error) {
      console.error("Gửi liên hệ thất bại:", error);
      message.error("Gửi liên hệ thất bại. Vui lòng thử lại!");
    }
  };
  return (
    <div style={{ padding: "40px", background: "#f5f5f5" }}>
      <Row gutter={[32, 32]}>
        {/* Form liên hệ */}
        <Col xs={24} md={14}>
          <Card style={{ padding: "24px" }}>
            <Title level={2}>Liên Hệ Với Chúng Tôi</Title>
            <Paragraph>
              Nếu bạn có bất kỳ câu hỏi hoặc phản hồi nào, đừng ngần ngại liên hệ.
            </Paragraph>
            <Form layout="vertical" onFinish={onFinish}  form={form}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>
              <Form.Item
  label="Số điện thoại"
  name="phone"
  rules={[
    { required: true, message: "Vui lòng nhập số điện thoại!" },
    { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ!" },
  ]}
>
  <Input placeholder="0123456789" />
</Form.Item>

              <Form.Item
                label="Nội dung"
                name="message"
                rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
              >
                <TextArea rows={5} placeholder="Nội dung liên hệ..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} size="large">
                  Gửi liên hệ
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Thông tin liên hệ */}
        <Col xs={24} md={10}>
          <Card style={{ padding: "24px", background: "#fafafa" }}>
            <Title level={3}>Thông Tin Liên Hệ</Title>
            <Paragraph>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
            </Paragraph>
            <Paragraph>
              <PhoneOutlined style={{ marginRight: 8 }} />
              Hotline: 0123 456 789
            </Paragraph>
            <Paragraph>
              <MailOutlined style={{ marginRight: 8 }} />
              Email: support@shopping.com
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
