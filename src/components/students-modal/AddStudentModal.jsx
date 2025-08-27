import React from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import useStudents from "../../hooks/useStudents";

const AddStudentModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { PostStudenst } = useStudents();
  const postMutation = PostStudenst();

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      enrollmentDate: values.enrollmentDate.format("YYYY-MM-DD"),
    };
    postMutation.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  return (
    <Modal
      title="Yangi Talaba Qo‘shish"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={postMutation.isLoading}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ismni kiriting!" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Telefon" rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email kiriting!" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="enrollmentDate" label="Ro‘yxatdan o‘tgan sana" rules={[{ required: true }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name="courses" label="Kurslar" rules={[{ required: true }]}>
          <Select mode="tags" placeholder="Kurslarni kiriting" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStudentModal;
