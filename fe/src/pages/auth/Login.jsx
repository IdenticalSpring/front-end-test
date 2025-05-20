import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { login } from '../../services/api';
import { Link } from 'react-router-dom';
import { showSuccessNotification, showErrorNotification } from '../../components/notifications';

const { Title } = Typography;

const Login = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await login(values.username, values.password);
      sessionStorage.setItem('token', res.data.access_token);
      showSuccessNotification('Thành công', 'Đăng nhập thành công');
      onSuccess();
    } catch (error) {
      showErrorNotification(
        'Lỗi',
        error.response?.data.message || 'Đăng nhập thất bại'
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
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Chào mừng trở lại</Title>
          <Typography.Text type="secondary">Đăng nhập vào tài khoản của bạn</Typography.Text>
        </div>
        
        <Form
          name="login"
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
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Mật khẩu"
              autoComplete="current-password" 
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
              Đăng nhập
            </Button>
          </Form.Item>
          
          <Divider plain>hoặc</Divider>
          
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Typography.Text type="secondary">Bạn chưa có tài khoản?</Typography.Text>
              <Link to="/register" style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                <UserAddOutlined style={{ marginRight: 4 }} /> Đăng ký
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;