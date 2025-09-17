import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
import useTeacher from "../../../hooks/useTeacher";
import InputNumberUi from "../../ui/InputNumber";

const TeacherCreateModal = ({ open, onCancel, branchId }) => {
    const { createTeacherMutation } = useTeacher(branchId);
    const [form] = Form.useForm();
    const [salaryType, setSalaryType] = useState(null);

    const handleFinish = (values) => {
        const payload = { ...values, branchId: Number(branchId) };

        if (payload.salaryType === "FIXED") {
            delete payload.paymentPercentage;
        } else if (payload.salaryType === "PERCENTAGE") {
            delete payload.baseSalary;
        }

        createTeacherMutation.mutate(payload, {
            onSuccess: () => {
                form.resetFields();
                onCancel();
            },
        });
    };

    return (
        <Modal title="Yangi O'qituvchi qo'shish" open={open} onCancel={onCancel} footer={null}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="firstName" label="Ism" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Familiya" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Telefon">
                    <Input />
                </Form.Item>

                <Form.Item name="salaryType" label="Maosh turi" rules={[{ required: true }]}>
                    <Select onChange={(val) => setSalaryType(val)}>
                        <Select.Option value="FIXED">Oylik (FIXED)</Select.Option>
                        <Select.Option value="PERCENTAGE">Foiz (PERCENTAGE)</Select.Option>
                    </Select>
                </Form.Item>

                {salaryType === "FIXED" && (
                    <Form.Item name="baseSalary" label="Oylik maosh" rules={[{ required: true }]}>
                        <InputNumberUi className="w-full" />
                    </Form.Item>
                )}

                {salaryType === "PERCENTAGE" && (
                    <Form.Item name="paymentPercentage" label="Foiz (%)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={1} max={100} 
                            defaultValue={10}
                            formatter={value => `${value}%`}
                            parser={value => value?.replace('%', '')}
                        />
                    </Form.Item>
                )}

                <Form.Item className="flex justify-end">
                    <Button type="primary" htmlType="submit" loading={createTeacherMutation.isLoading}>
                        Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TeacherCreateModal;
