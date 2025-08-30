import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Select, DatePicker, message, Button } from "antd";
import dayjs from "dayjs";
import useStudents from "../../hooks/useStudents";
import usePayment from "../../hooks/usePayment";

const { Option } = Select;

const PaymentAddModal = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const { GetStudents } = useStudents();
    const { postPaymentMutation } = usePayment();

    const { data: students = [], isLoading: isStudentsLoading } = GetStudents;

    const [selectedStudent, setSelectedStudent] = useState(null);

    // Student select tanlanganda
    const handleStudentChange = (id) => {
        const student = students.find((s) => s.id === id);
        setSelectedStudent(student || null);

        // Reset course va amount
        form.setFieldsValue({
            courseId: undefined,
            amount: undefined,
            studentName: student ? student.name : "",
            courseName: undefined,
        });
    };

    // Course select tanlanganda
    const handleCourseChange = (courseId) => {
        const course = selectedStudent?.courses.find((c) => c.id === courseId);
        if (course) {
            form.setFieldsValue({
                amount: course.fee,
                courseName: course.name,
            });
        }
    };

    const handleFinish = (values) => {
        if (!selectedStudent) {
            message.warning("Avval studentni tanlang!");
            return;
        }
        const payload = {
            studentId: Number(values.studentId),
            studentName: values.studentName,
            courseId: Number(values.courseId),
            courseName: values.courseName,
            amount: Number(values.amount),
            paymentDate: values.paymentDate.format("YYYY-MM-DD"),
            paymentMonth: values.paymentMonth  ? dayjs(values.paymentMonth).format("YYYY-MM")  : null,
        };

        postPaymentMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });

        form.resetFields();
        setSelectedStudent(null);
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            title="Yangi To'lov Qo'shish"
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{
                paymentDate: dayjs(), // ✅ boshlang'ich qiymat shu yerda
            }}
            >
                {/* Student select */}
                <Form.Item
                    label="Talaba"
                    name="studentId"
                    rules={[{ required: true, message: "Talabani tanlang!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Talabani qidiring va tanlang"
                        optionFilterProp="children"
                        loading={isStudentsLoading}
                        onChange={handleStudentChange}
                        filterOption={(input, option) =>
                            (option.children ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {students.map((s) => (
                            <Option key={s.id} value={s.id}>
                                {s.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Student Ismi" name="studentName">
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Kurs"
                    name="courseId"
                    rules={[{ required: true, message: "Kursni tanlang!" }]}
                >
                    <Select
                        placeholder="Kursni tanlang"
                        disabled={!selectedStudent}
                        onChange={handleCourseChange}
                    >
                        {selectedStudent?.courses?.map((c) => (
                            <Option key={c.id} value={c.id}>
                                {c.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Kurs nomi" name="courseName">
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Miqdor"
                    name="amount"
                    rules={[{ required: true, message: "Miqdorni kiriting!" }]}
                >
                    <InputNumber style={{ width: "100%" }} min={0} disabled={!selectedStudent} />
                </Form.Item>

                {/* OY */}

                <Form.Item
                    label="To'lov oyi"
                    name="paymentMonth"
                    rules={[{ required: true, message: "Oyni tanlang!" }]}
                >
                    <DatePicker picker="month" format="YYYY-MM" style={{ width: "100%" }} />
                </Form.Item>

                

                <Form.Item
                    label="To'lov sanasi"
                    name="paymentDate"
                    rules={[{ required: true, message: "Sanani tanlang!" }]}
                >
                    <DatePicker style={{ width: "100%" }} disabled={!selectedStudent} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PaymentAddModal;
