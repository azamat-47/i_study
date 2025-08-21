import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import useTeacher from "../hooks/useTeacher";

const ModalTeaEdit = ({ visible, onClose, teacher }) => {
  const [form] = Form.useForm();
  const { updateTeacherMutation } = useTeacher();

  useEffect(() => {
    if (teacher) {
      form.setFieldsValue({
        username: teacher.user?.username,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        salary: teacher.salary,
        password: "", // password bo‘sh boshlanishi
      });
    }
  }, [teacher, form]);

  const handleFinish = (values) => {
    const payload = {
      id: teacher.id,
      userId: teacher.user?.id,
      username: values.username,
      name: values.name,
      email: values.email,
      phone: values.phone,
      salary: values.salary,
      user: {},
    };

    // password faqat kiritilgan bo‘lsa yuborilsin
    if (values.password) {
      payload.user.password = values.password;
    }

    updateTeacherMutation.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Modal
      title="Teacher ma'lumotlarini tahrirlash"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Bekor qilish
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Saqlash
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Username kiriting!" },
            { min: 6, message: "Username kamida 6 belgidan bo‘lishi kerak!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { min: 6, message: "Password kamida 6 belgidan bo‘lishi kerak!" },
          ]}
        >
          <Input.Password placeholder="Yangi parol (agar o‘zgartirilsa)" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Name kiriting!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Email kiriting!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone kiriting!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: "Salary kiriting!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalTeaEdit;
