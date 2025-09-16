import React from "react";
import { Modal, Form, Input, Select } from "antd";
import useStudents from "../../../hooks/useStudents";
import { useGroups } from "../../../hooks/useGroups";

const StudentCreateModal = ({ open, onClose, branchId }) => {
  const [form] = Form.useForm();
  const { createStudentMutation } = useStudents(branchId);
  const { groupsQuery } = useGroups(branchId, { enabled: !!branchId });

  const handleOk = () => {
    form.validateFields().then((values) => {
      createStudentMutation.mutate(
        { ...values, branchId },
        {
          onSuccess: () => {
            onClose();
            form.resetFields();
          },
        }
      );
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="Yangi talaba qo'shish"
      confirmLoading={createStudentMutation.isLoading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="firstName"
          label="Ism"
          rules={[{ required: true, message: "Ism kiritilishi shart" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Familiya"
          rules={[{ required: true, message: "Familiya kiritilishi shart" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Telefon"
          rules={[{ required: true, message: "Telefon kiritilishi shart" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="groupIds"
          label="Guruh(lar)"
          rules={[{ required: true, message: "Kamida bitta guruh tanlang" }]}
        >
          <Select
            mode="multiple"
            placeholder="Guruhni tanlang"
            options={groupsQuery.data?.map((g) => ({
              label: g.name,
              value: g.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentCreateModal;
