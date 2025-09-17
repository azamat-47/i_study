import React from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import usePayment from '../../../hooks/usePayment';
import useStudents from '../../../hooks/useStudents'; // Talabalar ro'yxatini olish uchun
import useCourse from '../../../hooks/useCourse';// Kurslar ro'yxatini olish uchun (agar mavjud bo'lsa)
import { useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

const AddPaymentModal = ({ isVisible, onClose, branchId }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { createPaymentMutation } = usePayment(branchId);
  const { studentsQuery } = useStudents(branchId); // Barcha talabalarni olish
  // const { coursesQuery } = useCourses(branchId); // Agar kurslar uchun hook mavjud bo'lsa

  const students = studentsQuery.data || [];
  // const courses = coursesQuery.data || []; // Agar kurslar uchun hook mavjud bo'lsa

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date: values.date.toISOString(), // Day.js obyektini ISO stringga aylantirish
        branchId: branchId,
      };
      await createPaymentMutation.mutateAsync(payload);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("To'lov qo'shishda xatolik:", error);
    }
  };

  return (
    <Modal
      title="Yangi To'lov Qo'shish"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Bekor qilish
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={createPaymentMutation.isLoading}
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
          name="studentId"
          label="Talaba"
          rules={[{ required: true, message: "Talabani tanlang!" }]}
        >
          <Select
            placeholder="Talabani tanlang"
            loading={studentsQuery.isLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {students.map((student) => (
              <Option key={student._id} value={student._id}>
                {student.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="courseId"
          label="Kurs"
          rules={[{ required: true, message: "Kursni tanlang!" }]}
        >
          <Select
            placeholder="Kursni tanlang"
            // loading={coursesQuery.isLoading} // Agar kurslar uchun hook mavjud bo'lsa
          >
            {/* {courses.map((course) => (
              <Option key={course._id} value={course._id}>
                {course.name}
              </Option>
            ))} */}
            {/* Vaqtincha statik ma'lumot, agar useCourses hooki yo'q bo'lsa */}
            <Option value="654a8e2b8c9d0e1b2c3d4e5f">Matematika</Option>
            <Option value="654a8e2b8c9d0e1b2c3d4e60">Fizika</Option>
            <Option value="654a8e2b8c9d0e1b2c3d4e61">Ingliz tili</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Miqdor (UZS)"
          rules={[{ required: true, message: "Miqdorni kiriting!" }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
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

export default AddPaymentModal;