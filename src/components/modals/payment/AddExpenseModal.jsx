import React from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import useExpenses from '../../../hooks/useExpenses';
import InputNumberUi from '../../ui/InputNumber';

const { Option } = Select;

const AddExpenseModal = ({ isVisible, onClose, branchId }) => {
  const [form] = Form.useForm();

  const { createExpenseMutation } = useExpenses(branchId);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date: values.date.toISOString(), // Day.js obyektini ISO stringga aylantirish
        branchId: branchId,
      };
      await createExpenseMutation.mutateAsync(payload);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Xarajat qo'shishda xatolik:", error);
    }
  };

  return (
    <Modal
      title="Yangi Xarajat Qo'shish"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Bekor qilish
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={createExpenseMutation.isLoading}
          onClick={handleSubmit}
        >
          Qo'shish
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ date: dayjs() }}
      >
        <Form.Item
          name="category"
          label="Kategoriya"
          rules={[{ required: true, message: "Kategoriyani tanlang!" }]}
        >
          <Select placeholder="Kategoriyani tanlang">
            <Option value="RENT">Ijara</Option>
            <Option value="UTILITIES">Kommunal to'lovlar</Option>
            <Option value="MAINTENANCE">Remont</Option>
            <Option value="SUPPLIES">Offis jihozlar</Option>
            <Option value="OTHER">Boshqa</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Miqdor (UZS)"
          rules={[{ required: true, message: "Miqdorni kiriting!" }]}
        >
          <InputNumberUi placeholder="Miqdor" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Sana"
          rules={[{ required: true, message: "Sanani tanlang!" }]}
        >
          <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Izoh"
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddExpenseModal;