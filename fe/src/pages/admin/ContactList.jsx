import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { getContacts, createContact, updateContact, deleteContact } from '../../services/api';

export default function ContactList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getContacts();
    setList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (record = null) => {
    setEditingItem(record);
    setModalVisible(true);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingItem) {
      await updateContact(editingItem.id, values);
    } else {
      await createContact(values);
    }
    fetchData();
    setModalVisible(false);
  };

  const handleDelete = async (id) => {
    await deleteContact(id);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Message', dataIndex: 'message' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
         
          <Popconfirm title="Confirm delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      
      <Table rowKey="id" loading={loading} columns={columns} dataSource={list} />

      <Modal title={editingItem ? 'Edit Contact' : 'Create Contact'} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleSubmit}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
