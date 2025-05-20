import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  Form,
  Popconfirm,
  Space,
  Typography,
  Select,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  getFields,
  createField,
  updateField,
  deleteField,
} from '../../services/api';

const { Title } = Typography;

const FieldList = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [form] = Form.useForm();

  // Load danh sách sân bóng
  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await getFields();
      setFields(response.data);
    } catch (error) {
      console.error('Lỗi khi tải sân bóng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const showEditModal = (field = null) => {
    setEditingField(field);
    setIsModalVisible(true);
    if (field) {
      form.setFieldsValue(field);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingField(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingField) {
        await updateField(editingField.id, values);
      } else {
        await createField(values);
      }
      await fetchFields();
      handleCancel();
    } catch (error) {
      console.error('Lỗi khi lưu sân bóng:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteField(id);
      setFields(fields.filter((field) => field.id !== id));
    } catch (error) {
      console.error('Lỗi khi xoá sân bóng:', error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Tên sân', dataIndex: 'name' },
    { title: 'Vị trí', dataIndex: 'location' },
    { title: 'Giá / giờ', dataIndex: 'pricePerHour' },
    { title: 'Sức chứa', dataIndex: 'capacity' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} type="primary">
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xoá sân này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý sân bóng</Title>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => showEditModal(null)}
      >
        Thêm sân bóng
      </Button>

      <Table
        columns={columns}
        dataSource={fields}
        loading={loading}
        rowKey="id"
      />

      {/* Modal thêm / sửa */}
      <Modal
        title={editingField ? 'Chỉnh sửa sân bóng' : 'Thêm sân bóng'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Tên sân" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Vị trí" name="location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Sức chứa" name="capacity" rules={[{ required: true, message: 'Vui lòng chọn sức chứa' }]}>
  <Select placeholder="Chọn sức chứa">
    <Select.Option value={5}>5 người</Select.Option>
    <Select.Option value={7}>7 người</Select.Option>
    <Select.Option value={11}>11 người</Select.Option>
  </Select>
</Form.Item>

          <Form.Item label="Giá / giờ" name="pricePerHour" rules={[{ required: true }]}>
            <InputNumber min={0} step={1000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Hình ảnh (Base64)" name="image">
            <Input.TextArea rows={3} placeholder="Dán mã base64 hoặc URL" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingField ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FieldList;
