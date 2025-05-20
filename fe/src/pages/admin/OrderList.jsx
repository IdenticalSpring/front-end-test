import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Space, Tag, Typography, message } from 'antd';
import { getOrdersAll, updateOrder, deleteOrder, getWalletByUserId, updateWalletBalance } from '../../services/api';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrdersAll();
      console.log('Fetched orders:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Lỗi khi tải danh sách đơn đặt Sân!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Tính tiền thuê theo số giờ
  const calculateRentalPrice = (startTime, endTime, pricePerHour) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60); // Chuyển thành giờ
    return Math.ceil(diffHours) * pricePerHour;
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrder(id, { status });
      message.success(`Cập nhật trạng thái thành công: ${status}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      message.error('Cập nhật trạng thái thất bại!');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await deleteOrder(id);
      message.success('Xóa đơn đặt Sân thành công!');
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Xóa đơn thất bại!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatFullDateTime = (date, startTime, endTime) => {
    const formattedDate = formatDate(date);
    return `${formattedDate} | ${startTime} - ${endTime}`;
  };

  const handleAcceptOrder = async (order) => {
    try {
      const pricePerHour = order.field.pricePerHour;
      const rentalPrice = calculateRentalPrice(order.startTime, order.endTime, pricePerHour);

      const walletResponse = await getWalletByUserId(order.user.id);
      const currentBalance = walletResponse.data.balance;

      console.log('Số dư trước khi thanh toán:', currentBalance);
      console.log('Số tiền cần thanh toán:', rentalPrice);

      if (currentBalance < rentalPrice) {
        message.error('Số dư tài khoản không đủ để thanh toán.');
        return;
      }

      await updateWalletBalance(order.user.id, { balance: currentBalance - rentalPrice });

      const newWalletResponse = await getWalletByUserId(order.user.id);
      const newBalance = newWalletResponse.data.balance;
      console.log('Số dư sau khi thanh toán:', newBalance);

      await updateOrder(order.id, { status: 'accepted' });

      message.success('Đơn đặt Sân đã được chấp nhận và thanh toán thành công!');
      fetchOrders();
    } catch (error) {
      console.error('Lỗi khi chấp nhận đơn đặt Sân:', error);
      message.error('Lỗi khi chấp nhận đơn đặt Sân!');
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Đang chờ', color: 'orange' };
      case 'accepted':
        return { text: 'Đã chấp nhận', color: 'green' };
      case 'rejected':
        return { text: 'Đã từ chối', color: 'red' };
      default:
        return { text: status, color: 'default' };
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người đặt',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.username || 'Ẩn danh',
    },
    {
      title: 'Sân',
      dataIndex: 'field',
      key: 'field',
      render: (field) => field?.name || 'Không xác định',
    },
    {
      title: 'Thời gian đặt',
      key: 'dateRange',
      render: (_, record) =>
        formatFullDateTime(record.date, record.startTime, record.endTime),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { text, color } = getStatusDisplay(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleAcceptOrder(record)}
            disabled={record.status === 'accepted'}
          >
            Chấp nhận
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleUpdateStatus(record.id, 'rejected')}
            disabled={record.status === 'rejected'}
          >
            Từ chối
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn này?"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="default" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Danh sách đơn đặt Sân</Title>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default OrderList;
