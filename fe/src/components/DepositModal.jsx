import React from 'react';
import { Modal, Form, InputNumber, Button, Space, Alert } from 'antd';
import { depositMoney } from '../services/api';
import { showErrorNotification } from './notifications'; 

const DepositModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleDeposit = async (values) => {
    try {
      setLoading(true);
      const response = await depositMoney(values.amount);
      if (response.data && response.data.paymentLink) {
        window.location.href = response.data.paymentLink;
      } else {
        form.resetFields();
        onSuccess();
        onClose();
      }
    } catch (error) {
      showErrorNotification(
        'Lỗi',
        error.response?.data.message || 'Không thể nạp tiền'
      );
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Nạp tiền"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
    >
      <Alert
        message="Thông tin thanh toán"
        description="Sau khi nhấn nút Nạp tiền, bạn sẽ được chuyển đến trang thanh toán an toàn để hoàn tất giao dịch."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleDeposit}
        preserve={false}
      >
        <Form.Item
          name="amount"
          label="Số tiền (VND)"
          rules={[
            { required: true, message: 'Vui lòng nhập số tiền nạp' },
            { type: 'number', min: 2000, message: 'Số tiền tối thiểu là 2.000 VND' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập số tiền muốn nạp"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value) => value.replace(/\$\s?|(\.*)|(,*)/g, '')}
            min={2000}
            step={1000}
          />
        </Form.Item>
        
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Nạp tiền
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepositModal;