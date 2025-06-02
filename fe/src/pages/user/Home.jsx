import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Skeleton, Empty, Carousel, Divider, Rate, Badge, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getFields } from "../../services/api";
import blankImage from "../../assets/images/slider-1-slide-1-1920x671.jpg";
import { 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  DollarOutlined,
  ArrowRightOutlined,
  StarOutlined,
  FireOutlined,
  HeartOutlined,
  HeartFilled,
  SearchOutlined
} from '@ant-design/icons';
import NewsHighlight from "../../components/NewsHighlight";
import ChatWidget from '../../components/ChatWidget';

const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Hero carousel images
  const carouselImages = [
    {
      image: blankImage,
      title: "Sân bóng chất lượng cao",
      subtitle: "Đặt sân dễ dàng, nhanh chóng, tiện lợi"
    },
    {
      image: blankImage,
      title: "Nhiều lựa chọn sân bóng",
      subtitle: "Đa dạng khu vực và giá cả"
    },
    
  ];

  // Format price in VND
  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value);
  };

  // Fetch fields data
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const response = await getFields();
        
        // Add some mock data for better UI presentation
        const enhancedFields = response.data.map(field => ({
          ...field,
          rating: field.rating || (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
          reviewCount: field.reviewCount || Math.floor(Math.random() * 50) + 5, // Random review count
          location: field.location || "Hà Nội, Việt Nam",
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0, // 30% chance of having a discount
          isPopular: Math.random() > 0.7 // 30% chance of being popular
        }));
        
        setFields(enhancedFields);
      } catch (error) {
        console.error('Error fetching fields:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFields();
    
    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem('favoriteFields');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('favoriteFields', JSON.stringify(favorites));
  }, [favorites]);

  // Navigate to product detail page
  const goToProductDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  // Toggle favorite status
  const toggleFavorite = (e, id) => {
    e.stopPropagation(); // Prevent card click event
    
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Get field categories
  const getCategories = () => {
    const locations = [...new Set(fields.map(field => field.location))].slice(0, 5);
    return locations.map(location => ({
      name: location,
      count: fields.filter(field => field.location === location).length
    }));
  };

  return (
    <div className="home-container" style={{ background: '#f7f9fc' }}>
      {/* Hero Carousel Section */}
      

      {/* Navigation and Categories */}
      <section className="categories-section" style={{ marginBottom: '40px', padding: '0 24px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Title level={2} id="fields-section" style={{ margin: 0, fontWeight: '700', color: '#222' }}>
              Khám phá sân bóng
            </Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              onClick={() => navigate('/product')}
              icon={<SearchOutlined />}
              style={{ borderRadius: '6px' }}
            >
              Xem tất cả sân
            </Button>
          </Col>
        </Row>

        <Row gutter={16}>
          {loading ? (
            Array(5).fill(null).map((_, index) => (
              <Col key={index} xs={24} sm={12} md={6} lg={4}>
                <Skeleton.Button active block style={{ height: '60px', borderRadius: '8px' }} />
              </Col>
            ))
          ) : (
            getCategories().map((category, index) => (
              <Col key={index} xs={24} sm={12} md={6} lg={4}>
                <Button 
                  block 
                  style={{ 
                    height: '60px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderColor: '#eee'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <EnvironmentOutlined style={{ color: '#ff4d4f', marginRight: '8px', fontSize: '18px' }} />
                    <span style={{ fontWeight: 'bold' }}>{category.name}</span>
                  </div>
                  <Badge count={category.count} style={{ backgroundColor: '#52c41a' }} />
                </Button>
              </Col>
            ))
          )}
        </Row>
      </section>

      {/* Featured Fields */}
      <section className="featured-fields" style={{ padding: '0 24px', marginBottom: '40px' }}>
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center'
        }}>
          <FireOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginRight: '12px' }} />
          <Title level={3} style={{ margin: 0, fontWeight: '600', color: '#222' }}>
            Sân bóng nổi bật
          </Title>
        </div>

        {loading ? (
          <Row gutter={[24, 24]}>
            {Array(3).fill(null).map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card>
                  <Skeleton.Image style={{ width: '100%', height: '200px' }} active />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : fields.length === 0 ? (
          <Empty description="Không tìm thấy sân bóng nào" />
        ) : (
          <Row gutter={[24, 24]}>
            {fields.filter(field => field.isPopular).slice(0, 3).map((field) => (
              <Col key={field.id} xs={24} sm={12} md={8}>
                <Badge.Ribbon text="Nổi bật" color="#ff4d4f">
                  <Card
                    hoverable
                    style={{ 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      height: '100%'
                    }}
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img 
                          alt={field.name} 
                          src={field.image || blankImage} 
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '220px',
                            transition: 'transform 0.3s ease'
                          }} 
                        />
                        <Button 
                          shape="circle" 
                          icon={favorites.includes(field.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />} 
                          onClick={(e) => toggleFavorite(e, field.id)}
                          style={{ 
                            position: 'absolute', 
                            top: '12px', 
                            right: '12px',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}
                        />
                        {field.discount > 0 && (
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                          }}>
                            Giảm {field.discount}%
                          </div>
                        )}
                      </div>
                    }
                    onClick={() => goToProductDetail(field.id)}
                    bodyStyle={{ padding: '16px' }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Title level={4} style={{ margin: 0 }}>{field.name}</Title>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Rate disabled defaultValue={parseFloat(field.rating)} style={{ fontSize: '14px' }} />
                          <Text style={{ marginLeft: '4px' }}>{field.rating}</Text>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <EnvironmentOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                        <Text type="secondary">{field.location}</Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <DollarOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                          {formatVND(field.pricePerHour)}
                        </Text>
                        <Text type="secondary" style={{ marginLeft: '4px' }}>/giờ</Text>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tag color="blue">{field.reviewCount} đánh giá</Tag>
                        <Button type="primary" onClick={() => goToProductDetail(field.id)}>
                          Chi tiết <ArrowRightOutlined />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* All Fields */}
      <section className="all-fields" style={{ padding: '0 24px', marginBottom: '40px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Title level={3} style={{ margin: 0, fontWeight: '600', color: '#222' }}>
            Tất cả sân bóng
          </Title>
          <Button type="link" onClick={() => navigate('/product')}>
            Xem tất cả <ArrowRightOutlined />
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Đang tải danh sách sân bóng..." />
          </div>
        ) : fields.length === 0 ? (
          <Empty description="Không tìm thấy sân bóng nào" />
        ) : (
          <Row gutter={[24, 24]}>
            {fields.map((field) => (
              <Col key={field.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ 
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    height: '100%'
                  }}
                  cover={
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img 
                        alt={field.name} 
                        src={field.image || blankImage}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '200px',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <Button 
                        shape="circle" 
                        icon={favorites.includes(field.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />} 
                        onClick={(e) => toggleFavorite(e, field.id)}
                        style={{ 
                          position: 'absolute', 
                          top: '12px', 
                          right: '12px',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}
                      />
                      {field.discount > 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          Giảm {field.discount}%
                        </div>
                      )}
                    </div>
                  }
                  onClick={() => goToProductDetail(field.id)}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div>
                    <Title level={5} style={{ marginBottom: '8px', height: '44px', overflow: 'hidden' }}>
                      {field.name}
                    </Title>
                    
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <Rate disabled defaultValue={parseFloat(field.rating)} style={{ fontSize: '12px' }} />
                      <Text style={{ marginLeft: '4px' }}>({field.reviewCount})</Text>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <EnvironmentOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{field.location}</Text>
                    </div>
                    
                    <Divider style={{ margin: '8px 0' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Giá/giờ</Text>
                        <div>
                          <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                            {formatVND(field.pricePerHour)}
                          </Text>
                        </div>
                      </div>
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={() => goToProductDetail(field.id)}
                        style={{ borderRadius: '6px' }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* News Section */}
      <section className="news-section" style={{ padding: '24px' }}>
        <Divider orientation="left">
          <Title level={3} style={{ margin: 0 }}>Tin tức & Sự kiện</Title>
        </Divider>
        <NewsHighlight />
      </section>
      <ChatWidget/>

    </div>
  );
};

export default Home;