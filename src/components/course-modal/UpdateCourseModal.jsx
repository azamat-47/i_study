// UpdateCourseModal.jsx
import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
import useCourse from "../../hooks/useCourse";
import useTeacher from "../../hooks/useTeacher";

const { Option } = Select;

const UpdateCourseModal = ({ visible, onClose, course }) => {
  const [form] = Form.useForm();
  const { putCourseMutation } = useCourse();
  const { getTeachers } = useTeacher();

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        name: course.name,
        description: course.description,
        fee: course.fee,
        teacherId: course.teachers?.[0]?.id, // ustoz ID sini set qilamiz
      });
    }
  }, [course, form]);

  const handleFinish = (values) => {
    const selectedTeacher = getTeachers.data.find(
      (t) => t.id === values.teacherId
    );
    const payload = {
      id: course.id,
      name: values.name,
      description: values.description,
      fee: values.fee,
      teachers: selectedTeacher ? [selectedTeacher] : [],
    };
    putCourseMutation.mutate(payload, { onSuccess: onClose });
  };
  
  return (
    <Modal
      title="Kursni tahrirlash"
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
          label="Kurs nomi"
          name="name"
          rules={[{ required: true, message: "Kurs nomini kiriting!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ta'rif"
          name="description"
          rules={[{ required: true, message: "Ta'rif kiriting!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Narxi (fee)"
          name="fee"
          rules={[{ required: true, message: "Narxni kiriting!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Ustoz"
          name="teacherId"
          rules={[{ required: true, message: "Ustoz tanlang!" }]}
        >
          <Select
            placeholder="Ustozni tanlang"
            loading={getTeachers.isLoading}
          >
            {getTeachers.data?.map((teacher) => (
              <Option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCourseModal;
