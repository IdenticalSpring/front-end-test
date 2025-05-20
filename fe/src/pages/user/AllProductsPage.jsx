import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Input, Slider, Select, Grid, Spin } from 'antd';
import { getFields } from '../../services/api'; // API lấy danh sách sân bóng
import blankImage from "../../assets/images/slider-1-slide-1-1920x671.jpg";
import { useNavigate } from 'react-router-dom';
const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const AllProductsPage = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchText, setSearchText] = useState('');

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate(); 
  // Fetch data
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await getFields(); // gọi API getFields
        setFields(response.data);
      } catch (error) {
        console.error('Error fetching fields:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // Bộ lọc
  const filteredFields = fields.filter((field) => {
    const matchCapacity = selectedCapacity ? field.capacity === selectedCapacity : true;
    const matchPrice = field.pricePerHour >= priceRange[0] && field.pricePerHour <= priceRange[1];
    const matchSearch = field.name.toLowerCase().includes(searchText.toLowerCase());

    return matchCapacity && matchPrice && matchSearch;
  });

  const paginatedFields = filteredFields.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const goToProductDetail = (id) => {
    navigate(`/product-detail/${id}`); // Điều hướng đến trang chi tiết với id của sân bóng
  };
  const renderFilters = () => (
    <div style={{ padding: '16px', background: '#fff', borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.05)', marginBottom: isMobile ? 16 : 0 }}>
      <h3>Tìm kiếm</h3>
      <Search
        placeholder="Nhập tên sân bóng..."
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ marginBottom: 20 }}
      />

      <h3>Sức Chứa</h3>
      <Select
        style={{ width: '100%', marginBottom: 20 }}
        placeholder="Chọn sức chứa"
        onChange={(value) => setSelectedCapacity(value)}
        allowClear
      >
        <Option value={5}>Sân 5 người</Option>
        <Option value={7}>Sân 7 người</Option>
        <Option value={11}>Sân 11 người</Option>
      </Select>

      <h3>Lọc theo giá</h3>
      <Slider
        range
        min={0}
        max={1000000}
        step={50000}
        value={priceRange}
        onChange={setPriceRange}
        tipFormatter={(value) => `${value.toLocaleString()} VND`}
      />
    </div>
  );

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        {isMobile && (
          <Col span={24}>
            {renderFilters()}
          </Col>
        )}

        {!isMobile && (
          <Col span={6}>
            {renderFilters()}
          </Col>
        )}

        <Col span={isMobile ? 24 : 18}>
          <Row gutter={[16, 16]}>
            {paginatedFields.length > 0 ? (
              paginatedFields.map(field => (
                <Col xs={24} sm={12} md={8} key={field.id}>
                  <Card
                  onClick={() => goToProductDetail(field.id)} 
                    hoverable
                    cover={
                      <img
                        alt={field.name}
                        src={field.image || blankImage}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <div>
                          <div>{field.name}</div>
                          <div style={{ fontSize: '14px', color: '#888' }}>Sân {field.capacity} người</div>
                        </div>
                      }
                      description={`${field.pricePerHour.toLocaleString()} VND / giờ`}
                    />

                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: 'center', marginTop: '50px' }}>
                <p>Không tìm thấy sân nào.</p>
              </Col>
            )}
          </Row>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredFields.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: '20px', textAlign: 'center' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AllProductsPage;
