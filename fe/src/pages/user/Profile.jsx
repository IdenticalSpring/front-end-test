import React, { useState, useEffect } from 'react';
import { Card, Typography, Descriptions, Skeleton, Statistic, Row, Col, Button, Space, List } from 'antd';
import { UserOutlined, MailOutlined, WalletOutlined, ReloadOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getProfile, getOrders } from '../../services/api';
import { showErrorNotification } from '../../components/notifications';
import DepositModal from '../../components/DepositModal';

const { Title } = Typography;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositModalVisible, setDepositModalVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      showErrorNotification(
        'Lỗi',
        error.response?.data.message || 'Không thể tải thông tin cá nhân'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      showErrorNotification(
        'Lỗi',
        error.response?.data.message || 'Không thể tải thông tin đơn hàng'
      );
    }
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Thông tin cá nhân</Title>
      
      {loading ? (
        <Card>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      ) : (
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ 
                    width: 100, 
                    height: 100, 
                    margin: '0 auto 16px',
                    borderRadius: '50%',
                    background: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UserOutlined style={{ fontSize: 48, color: '#fff' }} />
                  </div>
                  <Title level={3}>{profile?.username}</Title>
                  <Typography.Text type="secondary">{profile?.email}</Typography.Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={16}>
              <Card 
                bordered={false}
                title="Thông tin tài khoản"
                style={{ marginBottom: 24 }}
              >
                <Descriptions column={1}>
                  <Descriptions.Item 
                    label={<span><UserOutlined /> Tên đăng nhập</span>}
                    labelStyle={{ fontWeight: 'bold' }}
                  >
                    {profile?.username}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<span><MailOutlined /> Email</span>}
                    labelStyle={{ fontWeight: 'bold' }}
                  >
                    {profile?.email}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              
              <Card 
                bordered={false} 
                title="Ví tiền"
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setDepositModalVisible(true)}
                  >
                    Nạp tiền
                  </Button>
                }
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Statistic
                    title="Số dư tài khoản"
                    value={profile?.balance || 0}
                    precision={0}
                    prefix={<WalletOutlined />}
                    suffix="VND"
                    valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                  />
                  
                  <Button 
                    type="default" 
                    icon={<ReloadOutlined />}
                    onClick={fetchProfile}
                  >
                    Cập nhật số dư
                  </Button>
                </Space>
              </Card>

              {/* Hiển thị đơn hàng */}
              <Card 
                bordered={false} 
                title="Đơn hàng"
                style={{ marginTop: 24 }}
              >
                <List
  itemLayout="horizontal"
  dataSource={orders}
  renderItem={order => (
    <List.Item>
      <List.Item.Meta
        avatar={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
        title={`Đơn hàng #${order.id}`}
        description={
          <div>
            <div>Ngày đặt: {order.date}</div>
            <div>Thời gian: {order.startTime} - {order.endTime}</div>
          </div>
        }
      />
      <div style={{ fontWeight: 'bold' }}>
        <div>
          Tên phòng: {order.field?.name || 'Không xác định'} - Giá: {order.field?.pricePerHour || 0} VND / Giờ
        </div>
      </div>
      <div style={{ fontWeight: 'bold', color: '#1890ff', marginLeft: 16 }}>
        {order.status}
      </div>
    </List.Item>
  )}
/>

              </Card>
            </Col>
          </Row>
        </Card>
      )}
      
      <DepositModal 
        visible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        onSuccess={fetchProfile}
      />
    </div>
  );
};

export default Profile;
