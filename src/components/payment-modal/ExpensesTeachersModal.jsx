import { Form, Modal, Select, Input, DatePicker, InputNumber } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import usePayment from "../../hooks/usePayments";
import useTeacher from "../../hooks/useTeachers";

const ExpensesTeachersModal = ({isOpen, onClose}) => {
  const { postTeacherSalaryExpenseMutation } = usePayment();
  const { getTeachers } = useTeacher();
  const { data: teachers = [], isLoading } = getTeachers;

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [form] = Form.useForm();

  const handleTeacherChange = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    setSelectedTeacher(teacher || null);

    form.setFieldsValue({
      salary: teacher ? teacher.salary : undefined,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
        const payload = {
            teacherId: Number(values.teacherId),
            month: values.paymentMonth ? dayjs(values.paymentMonth).format("YYYY-MM") : null,
        };

        
        postTeacherSalaryExpenseMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
                form.resetFields();
            },
        });
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Modal
      title="O'qituvchi maoshlarini to'lash"
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Form layout="vertical" form={form}>
        {/* O'qituvchi tanlash */}
        <Form.Item
          label="O'qituvchi"
          name="teacherId"
          rules={[{ required: true, message: "O'qituvchini tanlang!" }]}
        >
          <Select
            placeholder="O'qituvchini tanlang"
            showSearch
            optionFilterProp="children"
            onChange={handleTeacherChange}
            loading={isLoading}
          >
            {teachers.map((teacher) => (
              <Select.Option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Maosh (faqat ko‘rsatish uchun) */}
        <Form.Item label="Maosh miqdori" name="salary">
          <InputNumber
            style={{ width: "100%" }}
            disabled
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }
            parser={(value) => value.replace(/\s/g, "")}
          />
        </Form.Item>

        {/* Oy tanlash */}
        <Form.Item
          label="To'lov oyi"
          name="paymentMonth"
          rules={[{ required: true, message: "Oyni tanlang!" }]}
        >
          <DatePicker
            picker="month"
            format="YYYY-MM"
            placeholder="Oyni tanlang"
            style={{ width: "100%" }}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ExpensesTeachersModal;
