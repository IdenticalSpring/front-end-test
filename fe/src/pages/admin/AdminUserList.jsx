import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Space, Typography, message, Modal, Form, Input } from 'antd';
import { getUsers, updateUser, disableUser } from '../../services/api'; // API vừa cập nhật
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch user list
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mở modal chỉnh sửa
  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user); // Đưa dữ liệu user vào form
    setIsModalOpen(true);
  };

  // Submit form cập nhật user
  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(editingUser.id, values);
      message.success('Cập nhật người dùng thành công!');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Cập nhật thất bại!');
    }
  };

  // Xóa (vô hiệu hóa) user
  const handleDisableUser = async (id) => {
    try {
      await disableUser(id);
      message.success('Vô hiệu hóa người dùng thành công!');
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error disabling user:', error);
      message.error('Vô hiệu hóa thất bại!');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Cập nhật
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn vô hiệu hóa người dùng này?"
            onConfirm={() => handleDisableUser(record.id)}
            okText="Vô hiệu hóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>
              Vô hiệu hóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý người dùng</Title>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />

      {/* Modal cập nhật thông tin người dùng */}
      <Modal
        title="Cập nhật thông tin người dùng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdateUser}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserList;
