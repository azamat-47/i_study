import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import {useCourse} from "../../../hooks/useCourse";
import InputNumberUi from "../../ui/InputNumber";

const CourseEditModal = ({ open, onCancel, course, branchId }) => {
  const { updateCourseMutation } = useCourse(branchId);
  const [form] = Form.useForm();

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        name: course.name,
        description: course.description,
        price: course.price,
        durationMonths: course.durationMonths,
      });
    }
  }, [course, form]);

  const handleFinish = (values) => {
    const payload = { ...values, branchId };

    updateCourseMutation.mutate(
      { id: course.id, payload },
      {
        onSuccess: () => {
          form.resetFields();
          onCancel();
        },
      }
    );
  };

  return (
    <Modal
      title="Kursni Tahrirlash"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Kurs nomi"
          rules={[{ required: true, message: "Kurs nomini kiriting" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Tavsif"
          rules={[{ required: true, message: "Kurs tavsifini kiriting" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Narxi"
          rules={[{ required: true, message: "Narxni kiriting" }]}
        >
          <InputNumberUi className="w-full"  />
        </Form.Item>
        <Form.Item
          name="durationMonths"
          label="Davomiyligi (oy)"
          rules={[{ required: true, message: "Davomiylikni kiriting" }]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateCourseMutation.isLoading}
          >
            Yangilash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseEditModal;
