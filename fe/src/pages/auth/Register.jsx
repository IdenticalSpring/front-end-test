import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { register } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { showSuccessNotification, showErrorNotification } from '../../components/notifications';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await register(values.username, values.email, values.password);
      showSuccessNotification(
        'Thành công',
        response.data.message || 'Đăng ký thành công, vui lòng xác thực email của bạn'
      );
      navigate('/login');
    } catch (error) {
      showErrorNotification(
        'Lỗi',
        error.response?.data.message || 'Đăng ký thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Card 
        style={{ 
          width: 420, 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderRadius: '8px' 
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Tạo tài khoản mới</Title>
          <Typography.Text type="secondary">Tham gia cộng đồng ngay hôm nay</Typography.Text>
        </div>
        
        <Form
          name="register"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tên đăng nhập"
              autoComplete="username"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Địa chỉ email" 
              autoComplete="email"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Mật khẩu"
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={{ height: '46px', borderRadius: '4px' }}
            >
              Đăng ký
            </Button>
          </Form.Item>
          
          <Divider plain>hoặc</Divider>
          
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Typography.Text type="secondary">Đã có tài khoản?</Typography.Text>
              <Link to="/login" style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                <LoginOutlined style={{ marginRight: 4 }} /> Đăng nhập
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;