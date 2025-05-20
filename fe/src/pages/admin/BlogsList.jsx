import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Form, Popconfirm, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getBlogs, updateBlog, deleteBlog, createBlog } from '../../services/api';

const { Title } = Typography;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form] = Form.useForm(); // 👈 thêm để reset form sau khi submit

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs();
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const showEditModal = (blog = null) => {
    setEditingBlog(blog);
    setIsCreating(!blog);
    setIsModalVisible(true);
    form.setFieldsValue({
      title: blog?.title || '',
      content: blog?.content || '',
      image: blog?.image || '', // 👈 set thêm image
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBlog(null);
    form.resetFields(); // 👈 reset form
  };

  const handleUpdateBlog = async (values) => {
    try {
      await updateBlog(editingBlog.id, values);
      setIsModalVisible(false);
      setEditingBlog(null);
      const updatedBlogs = blogs.map((blog) =>
        blog.id === editingBlog.id ? { ...blog, ...values } : blog
      );
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleCreateBlog = async (values) => {
    try {
      const response = await createBlog(values);
      setIsModalVisible(false);
      const newBlog = { id: response.data?.id || Date.now(), ...values }; // ưu tiên id từ server
      setBlogs([...blogs, newBlog]);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (image) => (
        image ? <img src={image} alt="blog" style={{ width: 80, height: 50, objectFit: 'cover' }} /> : 'Không có'
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      render: (content) => <div>{content.slice(0, 50)}...</div>,
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            type="primary"
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteBlog(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Danh sách bài viết</Title>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => showEditModal()}
      >
        Thêm bài viết
      </Button>

      <Table
        columns={columns}
        dataSource={blogs}
        loading={loading}
        rowKey="id"
      />

      {/* Modal chỉnh sửa / thêm bài viết */}
      <Modal
        title={isCreating ? 'Thêm bài viết' : 'Chỉnh sửa bài viết'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={isCreating ? handleCreateBlog : handleUpdateBlog}
          layout="vertical"
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Hình ảnh (URL)"
            name="image"
            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn hình ảnh!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isCreating ? 'Thêm mới' : 'Cập nhật'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogList;
