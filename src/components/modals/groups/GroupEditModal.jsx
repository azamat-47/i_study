import React from "react";
import { Modal, Form, Input, TimePicker } from "antd";
import {useGroups} from "../../../hooks/useGroups";
import dayjs from "dayjs";

const GroupEditModal = ({ open, onClose, group, branchId }) => {
  const [form] = Form.useForm();
  const { updateGroupMutation } = useGroups(branchId);

  const handleOk = () => {
    form.validateFields().then((values) => {
      updateGroupMutation.mutate({
        id: group.id,
        payload: {
          ...values,
          startTime: values.startTime.format("HH:mm"),
          endTime: values.endTime.format("HH:mm"),
          branchId,
        },
      });
      onClose();
    });
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleOk} title="Guruhni tahrirlash">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...group,
          startTime: dayjs(group?.startTime, "HH:mm"),
          endTime: dayjs(group?.endTime, "HH:mm"),
        }}
      >
        <Form.Item name="name" label="Guruh nomi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="courseId" label="Kurs ID" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="teacherId" label="O'qituvchi ID" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="startTime" label="Boshlanish vaqti" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item name="endTime" label="Tugash vaqti" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupEditModal;
