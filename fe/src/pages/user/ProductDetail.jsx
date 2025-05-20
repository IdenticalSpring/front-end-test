import React, { useState, useEffect } from 'react';
import { 
  Button, Col, Row, Typography, Modal, DatePicker, Checkbox, notification, 
  Card, Tag, Divider, Skeleton, Spin, Space, Rate
} from 'antd';
import { useParams } from 'react-router-dom';
import { getFieldById, createOrder, getOrders } from "../../services/api";
import blankImage from "../../assets/images/slider-1-slide-1-1920x671.jpg";
import moment from 'moment';
import { 
  ClockCircleOutlined, DollarOutlined, EnvironmentOutlined, 
  CalendarOutlined, InfoCircleOutlined, CheckCircleOutlined 
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  
  useEffect(() => {
    const fetchFieldDetail = async () => {
      try {
        setLoading(true);
        const response = await getFieldById(id);
        setField(response.data);
      } catch (error) {
        console.error('Error fetching field detail:', error);
        notification.error({
          message: 'Lỗi tải thông tin',
          description: 'Không thể tải thông tin sân bóng. Vui lòng thử lại sau.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFieldDetail();
  }, [id]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        const orders = response.data;
        
        // Lọc các đơn đặt sân theo fieldId
        const fieldOrders = orders.filter(order => order.field.id === parseInt(id));

        // Xử lý: gom tất cả các giờ đã bị đặt thành 1 mảng bookedTimes
        let allBookedTimes = [];

        fieldOrders.forEach(order => {
          const start = moment(order.startTime, 'YYYY-MM-DD HH:mm');
          const end = moment(order.endTime, 'YYYY-MM-DD HH:mm');

          // Tách từng giờ từ start -> end
          let current = start.clone();
          while (current.isBefore(end)) {
            allBookedTimes.push({
              date: current.format('YYYY-MM-DD'),
              time: current.format('HH:00:00')
            });
            current.add(1, 'hour');
          }
        });

        setBookedSlots(allBookedTimes);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (isModalVisible) {
      fetchOrders();
    }
  }, [isModalVisible, id]);

  const renderDescriptionWithLineBreaks = (text) => {
    if (!text) return "";
    return text.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

  const calculateDuration = (startTime, endTime) => {
    const start = startTime.split(':');
    const end = endTime.split(':');
  
    const startMinutes = parseInt(start[0], 10) * 60 + parseInt(start[1], 10);
    const endMinutes = parseInt(end[0], 10) * 60 + parseInt(end[1], 10);
  
    const durationInMinutes = endMinutes - startMinutes;
    return durationInMinutes / 60; // Trả về số giờ
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const onDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimes([]);  // Reset selected times when date changes
  };

  const disabledDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < moment().startOf('day');
  };

  const handleOk = async () => {
    if (!selectedDate || selectedTimes.length !== 2) {
      notification.error({
        message: 'Thiếu thông tin',
        description: 'Vui lòng chọn đầy đủ ngày và 2 giờ (bắt đầu và kết thúc).',
      });
      return;
    }
  
    // Sắp xếp thời gian bắt đầu và kết thúc
    const sortedTimes = [...selectedTimes].sort();
  
    // Tính tổng tiền
    const duration = calculateDuration(sortedTimes[0], sortedTimes[1]);
    const totalPrice = duration * field.pricePerHour; // Tổng tiền = số giờ * giá mỗi giờ
  
    const orderData = {
      date: selectedDate.format('YYYY-MM-DD'),
      startTime: sortedTimes[0],
      endTime: sortedTimes[1],
      field: parseInt(id),
    };
  
    try {
      setOrderLoading(true);
      const response = await createOrder(orderData); 
      if (response.status === 201) {
        setIsModalVisible(false);
        notification.success({
          message: 'Đặt sân thành công',
          description: 'Bạn đã đặt sân thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          duration: 4,
        });
        setSelectedDate(null);
        setSelectedTimes([]);
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Có lỗi khi đặt sân. Vui lòng thử lại.',
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      notification.error({
        message: 'Lỗi hệ thống',
        description: 'Không thể đặt sân. Vui lòng thử lại sau.',
      });
    } finally {
      setOrderLoading(false);
    }
  };
  
  

  const handleTimeChange = (checkedValues) => {
    // Giới hạn chỉ chọn tối đa 2 giờ
    if (checkedValues.length > 2) {
      notification.warning({
        message: 'Vượt quá giới hạn',
        description: 'Bạn chỉ có thể chọn tối đa 2 giờ để đặt sân.',
        icon: <InfoCircleOutlined style={{ color: '#faad14' }} />,
      });
      return;
    }

    setSelectedTimes(checkedValues);
  };

  // Hàm kiểm tra nếu giờ đã được đặt
  const isTimeBooked = (time) => {
    if (!time || !selectedDate) return false;
    
    const selectedDay = selectedDate.format('YYYY-MM-DD');

    return bookedSlots.some(slot => 
      slot.date === selectedDay && slot.time === time
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" tip="Đang tải thông tin sân..." />
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!field) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Title level={3} type="danger">Không tìm thấy thông tin sân</Title>
        <Paragraph>Sân bạn tìm kiếm không tồn tại hoặc đã bị xóa.</Paragraph>
      </div>
    );
  }

  // Giả định: Thêm một số thông tin bổ sung cho field (có thể sửa lại API nếu cần)
  const fieldData = {
    ...field,
    location: field.location || 'Hà Nội, Việt Nam',
    rating: field.rating || 4.5,
    reviews: field.reviews || 28,
    amenities: field.amenities || ['Phòng thay đồ', 'Nước uống', 'Bãi đậu xe', 'Nhà vệ sinh']
  };

  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <div style={{ 
              position: 'relative',
              height: '100%', 
              minHeight: '400px',
              borderRadius: '8px',
              overflow: 'hidden' 
            }}>
              <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
  <img
    alt={fieldData.name}
    src={fieldData.image || blankImage}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    }}
  />
</div>

              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Rate disabled defaultValue={fieldData.rating} style={{ fontSize: '14px' }} />
                <span>({fieldData.reviews} đánh giá)</span>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Title level={1} style={{ marginBottom: '16px', color: '#1a1a1a' }}>
                {fieldData.name}
              </Title>
              
              <Space style={{ marginBottom: '16px' }}>
                <Tag color="cyan" icon={<EnvironmentOutlined />}>
                  {fieldData.location}
                </Tag>
                <Tag color="green" icon={<DollarOutlined />}>
                  {formatPrice(fieldData.pricePerHour)} / Giờ
                </Tag>
              </Space>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Title level={4}>Mô tả</Title>
              <Paragraph style={{ 
                fontSize: '16px', 
                color: '#595959',
                marginBottom: '16px',
                flexGrow: 1
              }}>
                {renderDescriptionWithLineBreaks(fieldData.description)}
              </Paragraph>
              
              <Title level={4}>Tiện ích</Title>
              <Row gutter={[8, 8]} style={{ marginBottom: '24px' }}>
                {fieldData.amenities.map((amenity, index) => (
                  <Col key={index}>
                    <Tag color="blue">
                      <CheckCircleOutlined style={{ marginRight: '4px' }} />
                      {amenity}
                    </Tag>
                  </Col>
                ))}
              </Row>
              
              <Button 
                type="primary" 
                size="large" 
                block 
                onClick={showModal}
                style={{ 
                  height: '50px', 
                  fontSize: '16px',
                  background: '#1890ff',
                  borderRadius: '8px',
                  marginTop: 'auto'
                }}
                icon={<CalendarOutlined />}
              >
                Đặt sân ngay
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Modal chọn ngày và giờ */}
      <Modal
        title={<Title level={3} style={{ margin: 0 }}>Đặt sân: {field.name}</Title>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        centered
        okText="Xác nhận đặt sân"
        cancelText="Hủy"
        confirmLoading={orderLoading}
        bodyStyle={{ padding: '24px' }}
      >
        <Card style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Chọn ngày
          </Title>
          <DatePicker
            format="DD/MM/YYYY"
            onChange={onDateChange}
            style={{ width: '100%', height: '40px' }}
            placeholder="Chọn ngày đặt sân"
            disabledDate={disabledDate}
          />
        </Card>

        <Card>
          <Title level={4} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Chọn giờ (Chọn 2 giờ: bắt đầu và kết thúc)
          </Title>
          
          {selectedDate ? (
            <div>
              <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                Bạn đã chọn: <Text strong>{selectedDate.format('DD/MM/YYYY')}</Text>
                {selectedTimes.length > 0 && (
  <>
    từ <Text strong>{selectedTimes[0] && selectedTimes[0].substring(0, 5)}</Text> 
    đến <Text strong>{selectedTimes[1] && selectedTimes[1].substring(0, 5)}</Text>
  </>
)}

              </Paragraph>
              
              <Checkbox.Group value={selectedTimes} onChange={handleTimeChange} style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  {Array.from({ length: 24 }, (_, index) => {
                    const time = moment().startOf('day').add(index, 'hours').format('HH:00:00');
                    const displayTime = time.substring(0, 5);
                    const isBooked = isTimeBooked(time);
                    
                    return (
                      <Col span={6} key={time}>
                        <Checkbox 
                          value={time} 
                          disabled={isBooked}
                          style={{ 
                            padding: '8px',
                            borderRadius: '6px',
                            background: isBooked ? '#f5f5f5' : (selectedTimes.includes(time) ? '#e6f7ff' : 'white'),
                            border: `1px solid ${isBooked ? '#d9d9d9' : (selectedTimes.includes(time) ? '#1890ff' : '#d9d9d9')}`,
                            width: '100%',
                            marginRight: 0
                          }}
                        >
                          <span style={{ 
                            color: isBooked ? '#bfbfbf' : (selectedTimes.includes(time) ? '#1890ff' : 'inherit')
                          }}>
                            {displayTime}
                            {isBooked && <span style={{ fontSize: '12px', marginLeft: '4px' }}>(Đã đặt)</span>}
                          </span>
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <InfoCircleOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '8px' }} />
              <Paragraph>Vui lòng chọn ngày trước khi chọn giờ</Paragraph>
            </div>
          )}
          
          <Divider />
          
          <Row justify="space-between" align="middle">
            <Col>
              <Text type="secondary">Giá thuê sân: {formatPrice(field.pricePerHour)} / giờ</Text>
            </Col>
            <Col>
              {selectedTimes.length === 2 && (
                 <Text strong>
                 Tổng tiền: {formatPrice(field.pricePerHour * calculateDuration(selectedTimes[0], selectedTimes[1]))}
               </Text>
              )}
            </Col>
          </Row>
        </Card>
      </Modal>
    </div>
  );
};

export default ProductDetail;