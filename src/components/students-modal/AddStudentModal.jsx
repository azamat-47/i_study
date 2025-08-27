import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import useStudents from "../../hooks/useStudents";
import useCourse from "../../hooks/useCourse";

const AddStudentModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { PostStudent } = useStudents();
  const { getCourses } = useCourse();
  const [courseOptions, setCourseOptions] = useState([]);

  // Courses load bo'lgandan keyin optionsni tayyorlaymiz
  useEffect(() => {
    if (getCourses.data) {
      setCourseOptions(
        getCourses.data.map((course) => ({
          label: course.name,  // UIda ko‘rinadigan nom
          value: course.id,    // submitda value sifatida jo‘natiladigan id
        }))
      );
    }
  }, [getCourses.data]);

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      enrollmentDate: values.enrollmentDate.format("YYYY-MM-DD"),
      courseIds: values.courseIds, // tanlangan idlar
    };
    PostStudent.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  return (
    <Modal
      title="Yangi Talaba Qo'shish"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={PostStudent.isLoading}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ismni kiriting!" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Telefon" rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email kiriting!" }, {type: "email", message: "Emailni to'g'ri kiring!"}]}>
          <Input />
        </Form.Item>
        <Form.Item name="enrollmentDate" label="Ro'yxatdan o'tgan sana" rules={[{ required: true }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name="courseIds" label="Kurslar" rules={[{ required: true, message: "Kursni tanlang!" }]}>
          <Select
            mode="multiple"       // bir nechta kurs tanlash uchun
            placeholder="Kurslarni tanlang"
            options={courseOptions} // bu yerda name → label, id → value
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStudentModal;
