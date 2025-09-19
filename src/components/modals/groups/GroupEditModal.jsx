import { Modal, Form, Input, TimePicker, Select, Row, Col } from "antd";
import dayjs from "dayjs";
import {useCourse} from "../../../hooks/useCourse";
import useTeacher from "../../../hooks/useTeacher";
// agar talabalar kerak bo'lsa, shu hookni yozib ishlatish mumkin
// import useStudents from "../../../hooks/useStudents";

const GroupEditModal = ({ open, onClose, group, branchId }) => {
  const [form] = Form.useForm();
  const { updateGroupMutation } = useGroups(branchId);
  const { coursesQuery } = useCourse(branchId, { enabled: !!branchId });
  const { teachersQuery } = useTeacher(branchId, { enabled: !!branchId });
  // const { studentsQuery } = useStudents(branchId, { enabled: !!branchId });

 

  const handleOk = () => {
    form.validateFields().then((values) => {
      updateGroupMutation.mutate({
        id: group.id,
        payload: {
          ...values,
          startTime: values.startTime
            ? dayjs(values.startTime).format("HH:mm")
            : null,
          endTime: values.endTime
            ? dayjs(values.endTime).format("HH:mm")
            : null,

          branchId,
        },
      });
      onClose();
    });
  };


  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="Guruhni tahrirlash"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...group,
          startTime: group?.startTime ? dayjs(group.startTime, "HH:mm") : null,
          endTime: group?.endTime ? dayjs(group.endTime, "HH:mm") : null,
          daysOfWeek: group?.daysOfWeek || [],
          studentIds: group?.studentIds || [],
        }}

      >
        {/* Guruh nomi */}
        <Form.Item
          name="name"
          label="Guruh nomi"
          rules={[{ required: true, message: "Guruh nomi kiritilishi kerak" }]}
        >
          <Input />
        </Form.Item>

        {/* Kurs tanlash */}
        <Form.Item
          name="courseId"
          label="Kurs"
          rules={[{ required: true, message: "Kurs tanlanishi kerak" }]}
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
          rules={[{ required: true, message: "O'qituvchi tanlanishi kerak" }]}
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


        <Row gutter={16}>
          <Col span={8}>
            {/* Haftalik kunlar */}
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
            {/* Boshlanish vaqti */}
            <Form.Item
              name="startTime"
              label="Boshlanish vaqti"
              rules={[{ required: true, message: "Boshlanish vaqti kerak" }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            {/* Tugash vaqti */}
            <Form.Item
              name="endTime"
              label="Tugash vaqti"
              rules={[{ required: true, message: "Tugash vaqti kerak" }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default GroupEditModal;
