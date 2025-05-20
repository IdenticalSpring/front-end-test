import { Layout, Menu, Typography, Avatar, Badge, Space, Button, Drawer, Dropdown, Row, Col } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  HomeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  MessageOutlined,
  HeartOutlined,
  LogoutOutlined,
  InfoOutlined,
  InfoCircleOutlined,
  ContactsOutlined
} from '@ant-design/icons';
import football from "../../assets/images/football.png"
import Slideshow from "../../components/Slideshow";
import ProductDetail from './ProductDetail';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const navItems = [
    { key: '1', icon: <HomeOutlined style={{ color: '#1890ff' }} />, label: 'Trang chủ', onClick: () => navigate('/user') },
    
    { key: '2', icon: <HeartOutlined style={{ color: '#1890ff' }} />, label: 'Đặt Sân Bóng', onClick: () => navigate('/product') },

    // { key: '4', icon: <MessageOutlined style={{ color: '#1890ff' }} />, label: 'Tin nhắn', onClick: () => navigate('/user/messages') },
    { key: '3', icon: <InfoCircleOutlined   style={{ color: '#1890ff' }} />, label: 'Giới thiệu', onClick: () => navigate('/about') },
    { key: '4', icon: <ContactsOutlined   style={{ color: '#1890ff' }} />, label: 'Liên hệ', onClick: () => navigate('/contact') },
    { key: '5', icon: <ContactsOutlined   style={{ color: '#1890ff' }} />, label: 'Hồ sơ', onClick: () => navigate('/user/profile') },
    // { key: '5', icon: <UserOutlined style={{ color: '#1890ff' }} />, label: 'Hồ sơ', oClick: () => navigate('/user/profile') },

  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      onClick: () => navigate('/user/profile')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        sessionStorage.removeItem('token');
        navigate('/login');
      }
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header
        style={{
          padding: '0 24px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#1890ff',
              marginRight: isMobile ? 16 : 64,
            }}
          >
            Football
          </Text>

          {!isMobile && (
            <div className="desktop-menu">
              <Menu
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ border: 'none', background: 'transparent', fontWeight: 500 }}
                items={navItems}
              />
            </div>
          )}

          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: '#1890ff', fontSize: 18 }} />}
              onClick={() => setMobileMenuVisible(true)}
              className="mobile-menu-btn"
            />
          )}
        </div>

        <Space size={isMobile ? 8 : 16} style={{ alignItems: 'center' }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Avatar
              style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>
      </Header>

      <Drawer
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={isMobile ? '80%' : 250}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: '16px', background: '#1890ff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>CIC</Text>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={navItems}
          style={{ border: 'none', height: '100%' }}
        />
      </Drawer>

      {location.pathname === '/user' && <Slideshow />}

      <Content
        style={{
          padding: isMobile ? '16px 12px' : '32px 24px',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          background: '#fff',
        }}
      >
        {children}
      </Content>

      {/* Footer */}
      <Footer style={{ backgroundColor: '#f1f1f1', padding: '20px 0', marginTop: 'auto' }}>
        <Row justify="center">
          <Col span={24} style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '16px', color: '#333' }}>© 2025 Football. All rights reserved.</Text>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: '10px' }}>
          <Col>
            <a href="#" style={{ margin: '0 10px', color: '#1890ff' }}>Privacy Policy</a>
            <a href="#" style={{ margin: '0 10px', color: '#1890ff' }}>Terms of Service</a>
            <a href="#" style={{ margin: '0 10px', color: '#1890ff' }}>Contact</a>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default UserLayout;
