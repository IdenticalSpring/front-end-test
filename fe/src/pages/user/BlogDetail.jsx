import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Typography, Skeleton, Image, Tag, Divider, Space, Button, Avatar, Row, Col, Tooltip 
} from 'antd';
import { 
  CalendarOutlined, EyeOutlined, HeartOutlined, HeartFilled,
  ShareAltOutlined, ArrowLeftOutlined, CommentOutlined
} from '@ant-design/icons';
import { getBlogById } from '../../services/api';
import { showErrorNotification } from '../../components/notifications';

const { Title, Paragraph, Text } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    fetchBlogDetail();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await getBlogById(id);
      setBlog(response.data);
    } catch (error) {
      showErrorNotification(
        'Lỗi',
        error.response?.data.message || 'Không thể tải chi tiết bài viết'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // Implement actual like functionality here
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    // You could add a notification here to show the URL was copied
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Card className="blog-detail-card">
        <Skeleton active avatar paragraph={{ rows: 1 }} />
        <Skeleton.Image style={{ width: '100%', height: 300 }} active />
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (!blog) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={3}>Không tìm thấy bài viết</Title>
          <Paragraph>Bài viết này có thể đã bị xóa hoặc không tồn tại</Paragraph>
          <Button type="primary" onClick={goBack}>Quay lại</Button>
        </div>
      </Card>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="blog-detail-container">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={goBack}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>
      
      <Card 
        bordered={false} 
        className="blog-detail-card"
        style={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 8
        }}
      >
        {/* Header section */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {blog.categories && blog.categories.length > 0 && (
            <Space size={[0, 8]} wrap>
              {blog.categories.map(category => (
                <Tag color="blue" key={category}>
                  {category}
                </Tag>
              ))}
            </Space>
          )}
          
          <Title 
            level={1} 
            style={{ 
              fontSize: '2.5rem', 
              marginBottom: 0,
              fontWeight: 700
            }}
          >
            {blog.title}
          </Title>
          
          {/* Author and date info */}
          <Row align="middle" gutter={16}>
            <Col>
              <Avatar 
                src={blog.author?.avatar || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} 
                size={40}
              />
            </Col>
            <Col>
              <Text strong>{blog.author?.name || 'Tác giả'}</Text>
              <br />
              <Space size="small">
                <CalendarOutlined />
                <Text type="secondary">{formattedDate}</Text>
                {blog.readTime && (
                  <>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">{blog.readTime} phút đọc</Text>
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </Space>

        <Divider />

        {/* Featured image */}
        {blog.image && (
          <div style={{ margin: '20px 0' }}>
            <Image
              src={blog.image}
              alt={blog.title}
              style={{ 
                width: '100%', 
                maxHeight: 500, 
                objectFit: 'cover',
                borderRadius: 8
              }}
              preview={{ mask: 'Xem ảnh đầy đủ' }}
            />
            {blog.imageCaption && (
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
                {blog.imageCaption}
              </Text>
            )}
          </div>
        )}

        {/* Blog content */}
        <div 
  className="blog-content"
  style={{ fontSize: '16px', lineHeight: 1.8, whiteSpace: 'pre-line' }}
>
  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
</div>


        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div style={{ margin: '24px 0' }}>
            <Text strong style={{ marginRight: 8 }}>Tags:</Text>
            {blog.tags.map(tag => (
              <Tag key={tag} style={{ margin: '4px' }}>
                {tag}
              </Tag>
            ))}
          </div>
        )}

        <Divider />

        {/* Interaction section */}
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Tooltip title={liked ? 'Bỏ thích' : 'Thích bài viết'}>
                <Button 
                  type="text" 
                  icon={liked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />} 
                  onClick={handleLike}
                >
                  {blog.likes || 0} Thích
                </Button>
              </Tooltip>
              <Tooltip title="Bình luận">
                <Button 
                  type="text" 
                  icon={<CommentOutlined />}
                >
                  {blog.comments || 0} Bình luận
                </Button>
              </Tooltip>
              <Tooltip title="Lượt xem">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                >
                  {blog.views || 0} Lượt xem
                </Button>
              </Tooltip>
            </Space>
          </Col>
          <Col>
            <Tooltip title="Chia sẻ bài viết">
              <Button 
                type="primary" 
                icon={<ShareAltOutlined />} 
                onClick={handleShare}
              >
                Chia sẻ
              </Button>
            </Tooltip>
          </Col>
        </Row>
        
        {/* You could add related posts section here */}
      </Card>
    </div>
  );
};

export default BlogDetail;