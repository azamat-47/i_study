import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import useStudents from "../../hooks/useStudents";

const EditStudentModal = ({ visible, onClose, student }) => {
  const [form] = Form.useForm();
  const { PutStudent } = useStudents();
  const putMutation = PutStudent();

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        ...student,
        enrollmentDate: dayjs(student.enrollmentDate),
      });
    }
  }, [student, form]);

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      id: student.id,
      enrollmentDate: values.enrollmentDate.format("YYYY-MM-DD"),
    };
    putMutation.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  return (
    <Modal
      title="Talabani Tahrirlash"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={putMutation.isLoading}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="name" label="Ism" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Telefon" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
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

export default EditStudentModal;
