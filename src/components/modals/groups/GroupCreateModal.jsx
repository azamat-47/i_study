import React from "react";
import { Modal, Form, Input, TimePicker, Select, Row, Col } from "antd";
import dayjs from "dayjs";
import {useCourse} from "../../../hooks/useCourse";
import useTeacher from "../../../hooks/useTeacher";

const GroupCreateModal = ({ open, onClose, branchId }) => {
  const [form] = Form.useForm();
  const { createGroupMutation } = useGroups(branchId);

  const { coursesQuery } = useCourse(branchId, { enabled: !!branchId });
  const { teachersQuery } = useTeacher(branchId, { enabled: !!branchId });
  console.log(teachersQuery.data);

  const handleOk = () => {
    form.validateFields().then((values) => {
      createGroupMutation.mutate({
        ...values,
        branchId,
        startTime: values.startTime
          ? dayjs(values.startTime).format("HH:mm")
          : null,
        endTime: values.endTime
          ? dayjs(values.endTime).format("HH:mm")
          : null,

      });
      onClose();
      form.resetFields();
    });
  };


  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="Yangi guruh qo'shish"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Guruh nomi"
          rules={[
            { required: true, message: "Iltimos guruh nomini kiriting" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Kurs tanlash */}
        <Form.Item
          name="courseId"
          label="Kurs"
          rules={[
            { required: true, message: "Iltimos kursni tanlang" },
          ]}
        >
          <Select
            loading={coursesQuery.isLoading}
            placeholder="Kursni tanlang"
            options={coursesQuery.data?.map((course) => ({
              label: course.name,
              value: course.id,
            }))}
          />
        </Form.Item>

        {/* O'qituvchi tanlash */}
        <Form.Item
          name="teacherId"
          label="O'qituvchi"
          rules={[
            { required: true, message: "Iltimos o'qituvchini tanlang" },
          ]}
        >
          <Select
            loading={teachersQuery.isLoading}
            placeholder="O'qituvchini tanlang"
            options={teachersQuery.data?.map((teacher) => ({
              label: teacher.firstName + " " + teacher.lastName,
              value: teacher.id,
            }))}
          />
        </Form.Item>

        {/* Vaqt tanlash */}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="daysOfWeek"
              label="Hafta kunlari"
              rules={[{ required: true, message: "Hafta kunlarini tanlang" }]}
            >
              <Select
                mode="multiple"
                placeholder="Kunlarni tanlang"
                options={[
                  { label: "Dushanba", value: "MONDAY" },
                  { label: "Seshanba", value: "TUESDAY" },
                  { label: "Chorshanba", value: "WEDNESDAY" },
                  { label: "Payshanba", value: "THURSDAY" },
                  { label: "Juma", value: "FRIDAY" },
                  { label: "Shanba", value: "SATURDAY" },
                  { label: "Yakshanba", value: "SUNDAY" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="startTime"
              label="Boshlanish vaqti"
              rules={[
                { required: true, message: "Iltimos boshlanish vaqtini tanlang" },
              ]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="endTime"
              label="Tugash vaqti"
              rules={[
                { required: true, message: "Iltimos tugash vaqtini tanlang" },
              ]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  );
};

export default GroupCreateModal;
