import React from "react";
import { Modal, Form, Input, TimePicker, Space } from "antd";
import { useGroups } from "../../../hooks/useGroups";

const GroupCreateModal = ({ open, onClose, branchId }) => {
  const [form] = Form.useForm();
  const { createGroupMutation } = useGroups(branchId);

  const handleOk = () => {
    form.validateFields().then((values) => {
      createGroupMutation.mutate({
        ...values,
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
        branchId,
      });
      onClose();
      form.resetFields();
    });
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleOk} title="Yangi guruh qo'shish">
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Guruh nomi" rules={[{ required: true, message: "Iltimos Guruh malumotlarni tuliq kiriting" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="courseId" label="Kurs ID" rules={[{ required: true, message: "Iltimos Guruh malumotlarni tuliq kiriting" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="teacherId" label="O'qituvchi ID" rules={[{ required: true, message: "Iltimos Guruh malumotlarni tuliq kiriting" }]}>
          <Input />
        </Form.Item>
        <Space direction="horizontal"  style={{ display: 'flex' }}>
          <Form.Item
            name="startTime"
            label="Boshlanish vaqti"
            rules={[{ required: true, message: "Iltimos Guruh malumotlarni tuliq kiriting" }]}
            style={{ flex: 1 }}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Tugash vaqti"
            rules={[{ required: true, message: "Iltimos Guruh malumotlarni tuliq kiriting" }]}
            style={{ flex: 1 }}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Space>

      </Form>
    </Modal>
  );
};

export default GroupCreateModal;
