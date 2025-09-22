import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import useStudents from "../../../hooks/useStudents";
import { useCourse } from "../../../hooks/useCourse";

const StudentCreateModal = ({ open, onClose, branchId, group }) => {
  const [form] = Form.useForm();
  const { createStudentMutation } = useStudents(branchId);
  const { groupsQuery } = useCourse(branchId, { enabled: !!branchId });

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (group) {
        // agar GroupDetail dan kelgan bo‘lsa, default qiymat shu guruh
        form.setFieldsValue({
          groupIds: [group.id],
        });
      }
    }
  }, [open, group, form]);

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
          {group ? (
            // faqat bitta guruh fixed bo‘ladi
            <Select
              mode="multiple"
              disabled
              options={[{ label: group.name, value: group.id }]}
            />
          ) : (
            <Select
              mode="multiple"
              placeholder="Guruhni tanlang"
              options={groupsQuery.data?.map((g) => ({
                label: g.name,
                value: g.id,
              }))}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentCreateModal;
