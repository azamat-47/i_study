import React from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import useCourse from "../../../hooks/useCourse";
import InputNumberUi from "../../ui/InputNumber";

const CourseCreateModal = ({ open, onCancel, branchId }) => {
  const { createCourseMutation } = useCourse(branchId);
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const payload = { 
        ...values, 
        branchId: Number(branchId)  // string → number
      };

      console.log("CourseCreateModal payload", payload);
      
    

    createCourseMutation.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        onCancel();
      },
    });
  };

  return (
    <Modal
      title="Yangi Kurs Qo'shish"
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

        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={createCourseMutation.isLoading}
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseCreateModal;
