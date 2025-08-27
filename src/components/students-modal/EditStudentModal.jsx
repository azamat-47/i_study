import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import useStudents from "../../hooks/useStudents";
import useCourse from "../../hooks/useCourse";

const EditStudentModal = ({ visible, onClose, student }) => {
  const [form] = Form.useForm();
  const { PutStudent } = useStudents();
  const { getCourses } = useCourse();
  const [courseOptions, setCourseOptions] = useState([]);

  // Courses ni optionsga aylantirish
  useEffect(() => {
    if (getCourses.data) {
      setCourseOptions(
        getCourses.data.map((course) => ({
          label: course.name,  
          value: course.id,    
        }))
      );
    }
  }, [getCourses.data]);

  // Student ma'lumotlarini formga yuklash
  useEffect(() => {
    if (student && courseOptions.length > 0) {
      // Student kurslarini name bo'yicha options bilan moslashtirish
      const studentCourseIds = student.courses?.map((studentCourse) => {
        // Agar studentCourse da name bor bo'lsa, uni options bilan match qilish
        const matchedOption = courseOptions.find(option => 
          option.label === studentCourse.name || option.label === studentCourse
        );
        return matchedOption ? matchedOption.value : null;
      }).filter(Boolean) || []; // null qiymatlarni olib tashlash
      
      console.log("Student courses:", student.courses);
      console.log("Matched course IDs:", studentCourseIds);
      
      form.setFieldsValue({
        ...student,
        enrollmentDate: dayjs(student.enrollmentDate),
        courseIds: studentCourseIds, 
      });
    }
  }, [student, form, courseOptions]);

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      id: student.id,
      enrollmentDate: values.enrollmentDate.format("YYYY-MM-DD"),
      courseIds: values.courseIds,
    };

    console.log("Submitting payload:", payload);
    
    PutStudent.mutate(payload, {
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
      confirmLoading={PutStudent.isLoading}
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
        <Form.Item name="enrollmentDate" label="Ro'yxatdan o'tgan sana" rules={[{ required: true }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name="courseIds" label="Kurslar" rules={[{ required: true, message: "Kursni tanlang!" }]}>
          <Select
            mode="multiple"
            placeholder="Kurslarni tanlang"
            options={courseOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditStudentModal;