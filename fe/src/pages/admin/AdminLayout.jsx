import { Layout, Menu, Typography, Avatar, Space, Badge, Button, Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  WalletOutlined,
  TeamOutlined,
  PhoneOutlined, // icon cho User Management
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setDrawerVisible(false);
    }
  }, [isMobile]);

  const menuItems = [
    
    {
      key: '2',
      icon: <WalletOutlined />,
      label: 'Nạp tiền chờ duyệt',
      onClick: () => {
        navigate('/admin/pending-deposits');
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: 'Đặt sân',
      onClick: () => {
        navigate('/admin/oder');
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: 'Sân bóng',
      onClick: () => {
        navigate('/admin/fleld');
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: '5',
      icon: <BellOutlined />,
      label: 'Blog',
      onClick: () => {
        navigate('/admin/blog');
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: '6',
      icon: <TeamOutlined />,
      label: 'Người dùng',
      onClick: () => {
        navigate('/admin/users');
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      type: 'divider',
      style: { margin: '8px 0' },
    },
    {
      key: '7',
      icon: <PhoneOutlined />,
      label: 'Contact',
      onClick: () => {
        navigate('/admin/contact');
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: '8',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        sessionStorage.removeItem('token');
        navigate('/login');
      },
      style: { color: '#ff4d4f' },
    },
  ];

  // Xác định tiêu đề trang dựa vào URL hiện tại
  const getPageTitle = () => {
    const path = window.location.pathname;
   
    if (path === '/admin/pending-deposits') return 'Nạp tiền chờ duyệt';
    if (path === '/admin/oder') return 'Đặt sân';
    if (path === '/admin/fleld') return 'Sân bóng';
    if (path === '/admin/blog') return 'Blog';
    if (path === '/admin/users') return 'Người dùng';
    return 'Quản trị';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 2,
          }}
          theme="light"
          trigger={null}
        >
          <div
            style={{
              padding: '16px 12px',
              textAlign: 'center',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: 8,
            }}
          >
            <Title level={4} style={{ color: '#1890ff', margin: 0, fontSize: 16 }}>
              {collapsed ? 'QT' : 'QUẢN TRỊ VIÊN'}
            </Title>
          </div>

          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{
              borderRight: 0,
              padding: '4px',
            }}
            items={menuItems}
          />
        </Sider>
      )}

      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={isMobile && drawerVisible}
        width={250}
        bodyStyle={{ padding: 0 }}
        style={{ zIndex: 999 }}
      >
        <div
          style={{
            padding: '16px 12px',
            textAlign: 'center',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 8,
            background: '#1890ff',
            color: '#fff',
          }}
        >
          <Title level={4} style={{ color: 'white', margin: 0, fontSize: 18 }}>
            QUẢN TRỊ VIÊN
          </Title>
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{
            borderRight: 0,
          }}
          items={menuItems}
        />
      </Drawer>

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 220,
          transition: 'all 0.2s',
        }}
      >
        <Header
          style={{
            background: '#fff',
            padding: '0 16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined style={{ fontSize: 16 }} />}
                onClick={() => setDrawerVisible(true)}
              />
            ) : collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: 16, cursor: 'pointer', color: '#1890ff' }}
                onClick={() => setCollapsed(false)}
              />
            ) : (
              <MenuFoldOutlined
                style={{ fontSize: 16, cursor: 'pointer', color: '#1890ff' }}
                onClick={() => setCollapsed(true)}
              />
            )}
            <Title level={4} style={{ margin: '0 0 0 16px', fontSize: 16 }}>
              {getPageTitle()}
            </Title>
          </div>
          <Space size={isMobile ? 8 : 16}>
            <Badge dot>
              <BellOutlined style={{ fontSize: 16, color: '#8c8c8c' }} />
            </Badge>
            <Space size={8}>
              <Avatar size="small" style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              {!isMobile && (
                <Text strong className="admin-username" style={{ fontSize: 14 }}>
                  Quản trị viên
                </Text>
              )}
            </Space>
          </Space>
        </Header>

        <Content
          style={{
            margin: isMobile ? '8px' : '16px',
            padding: isMobile ? '12px' : '16px',
            background: '#fff',
            borderRadius: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
