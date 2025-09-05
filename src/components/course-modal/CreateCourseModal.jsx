// CreateCourseModal.jsx
import React from "react";
import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
import useCourse from "../../hooks/useCourse";
import useTeacher from "../../hooks/useTeacher"; // ustozlarni tanlash uchun

const { Option } = Select;

const CreateCourseModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { addCourseMutation } = useCourse();
  const { getTeachers } = useTeacher();
  

  const handleFinish = (values) => {
    // Tanlangan ID bo'yicha teacher objectni topamiz
    const selectedTeacher = getTeachers.data.find(
      (t) => t.id === values.teacherId
    );



    const payload = {
      name: values.name,
      description: values.description,
      fee: values.fee,
      teachers: [selectedTeacher], // to'liq obyekt yuboriladi
    };



    addCourseMutation.mutate(payload, {
      onSuccess: () => {
        onClose();           // modal yopish
        form.resetFields();  // formani tozalash
      },
    });
    
  };

  return (
    <Modal
      title="Yangi kurs qo'shish"
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ fee: 0 }}
      >
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
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }
            parser={(value) => value.replace(/\s/g, "")}
          />
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

export default CreateCourseModal;
