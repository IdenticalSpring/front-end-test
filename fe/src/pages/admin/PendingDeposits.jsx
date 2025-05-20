import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Tag, Space, Modal, Tooltip, Statistic, Row, Col } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, UserOutlined, CalendarOutlined, WalletOutlined } from '@ant-design/icons';
import { getPendingTransactions, confirmDeposit } from '../../services/api';
import { showSuccessNotification, showErrorNotification } from '../../components/notifications';

const { Title, Text } = Typography;
const { confirm } = Modal;

const PendingDeposits = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [confirmingId, setConfirmingId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      const response = await getPendingTransactions();
      setTransactions(response.data);
    } catch (error) {
      showErrorNotification(
        'Lỗi',
        error.response?.data.message || 'Không thể tải dữ liệu giao dịch đang chờ'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const handleConfirm = (transactionId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xác nhận giao dịch này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Sau khi xác nhận, tiền sẽ được cộng vào ví của người dùng.',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setConfirmingId(transactionId);
          await confirmDeposit(transactionId);
          showSuccessNotification(
            'Thành công',
            'Giao dịch đã được xác nhận thành công'
          );
          fetchPendingTransactions();
        } catch (error) {
          showErrorNotification(
            'Lỗi',
            error.response?.data.message || 'Không thể xác nhận giao dịch'
          );
        } finally {
          setConfirmingId(null);
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <Space direction="vertical" size={0}>
          <Text strong><UserOutlined /> {user.username}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{user.email}</Text>
        </Space>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Statistic 
          value={amount} 
          precision={0} 
          valueStyle={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}
          suffix="VND" 
        />
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Space>
            <CalendarOutlined />
            <span>{new Date(date).toLocaleDateString()}</span>
          </Space>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ['md'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusText = status === 'pending' ? 'Chờ xử lý' : status;
        return (
          <Tag color="orange">
            {statusText.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
      responsive: ['lg'],
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          size={isMobile ? "small" : "middle"}
          onClick={() => handleConfirm(record.id)}
          loading={confirmingId === record.id}
        >
          {!isMobile && "Xác nhận"}
        </Button>
      ),
    },
  ];


  const MobileTransactionCard = ({ transaction }) => (
    <Card
      style={{ marginBottom: 16 }}
      actions={[
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => handleConfirm(transaction.id)}
          loading={confirmingId === transaction.id}
          block
        >
          Xác nhận
        </Button>
      ]}
    >
      <Row gutter={[8, 16]}>
        <Col span={24}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Space>
              <UserOutlined />
              <Text strong>{transaction.user.username}</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>{transaction.user.email}</Text>
          </Space>
        </Col>
        
        <Col span={12}>
          <Text type="secondary">ID:</Text>
          <div><Text strong>{transaction.id}</Text></div>
        </Col>
        
        <Col span={12}>
          <Text type="secondary">Trạng thái:</Text>
          <div>
            <Tag color="orange">
              {transaction.status === 'pending' ? 'CHỜ XỬ LÝ' : transaction.status.toUpperCase()}
            </Tag>
          </div>
        </Col>
        
        <Col span={12}>
          <Text type="secondary">Ngày tạo:</Text>
          <div><CalendarOutlined /> {new Date(transaction.createdAt).toLocaleDateString()}</div>
        </Col>
        
        <Col span={12}>
          <Text type="secondary">Số tiền:</Text>
          <div>
            <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
              {transaction.amount.toLocaleString()} VND
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const calculateTotal = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: isMobile ? 16 : 24, 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '12px' : '0'
      }}>
        <Title level={isMobile ? 3 : 2} style={{ marginBottom: isMobile ? 0 : 24 }}>
          {isMobile ? 'Giao dịch chờ xử lý' : 'Giao dịch nạp tiền chờ xử lý'}
        </Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchPendingTransactions}
          loading={loading}
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          Làm mới
        </Button>
      </div>

      {isMobile ? (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Statistic
              title="Tổng số tiền chờ duyệt"
              value={calculateTotal()}
              precision={0}
              prefix={<WalletOutlined />}
              suffix="VND"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>Đang tải...</div>
          ) : transactions.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>Không có dữ liệu</div>
            </Card>
          ) : (
            transactions.map(transaction => (
              <MobileTransactionCard key={transaction.id} transaction={transaction} />
            ))
          )}
        </>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            locale={{
              emptyText: 'Không có dữ liệu',
              filterConfirm: 'Đồng ý',
              filterReset: 'Đặt lại',
            }}
            summary={(pageData) => {
              let totalAmount = 0;
              pageData.forEach(({ amount }) => {
                totalAmount += amount;
              });

              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Text strong>Tổng cộng</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong style={{ color: '#1890ff' }}>
                      <WalletOutlined /> {totalAmount.toLocaleString()} VND
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} colSpan={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default PendingDeposits;