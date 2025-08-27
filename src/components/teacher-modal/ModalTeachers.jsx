// TeacherModal.js
import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import useTeacher from "../../hooks/useTeacher";


const ModalTeachers = ({ visible, onClose, teacher }) => {
    const [form] = Form.useForm();
    const { addTeacherMutation } = useTeacher();


    const handleFinish = (values) => {     
           
            addTeacherMutation.mutate(values, { onSuccess: onClose });
            console.log(values);
            
        
    };

    return (
        <Modal
            title="Yangi Teacher qo'shish"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Bekor qilish
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    Saqlash
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ salary: 0 }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: "Username kiriting!" },
                        { min: 6, message: "Username kamida 6 belgidan bo‘lishi kerak!" },
                      ]}
                >
                    <Input />
                </Form.Item>

                {!teacher && (
                    <Form.Item
                        label="Parol"
                        name="password"
                        rules={[
                            { required: true, message: "Password kiriting!" },
                            { min: 6, message: "Parol kamida 6 belgidan bo'lishi kerak!" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                )}

                <Form.Item
                    label="Ism Familiya"
                    name="name"
                    rules={[{ required: true, message: "Name kiriting!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email kiriting!" },
                        { type: "email", message: "Email noto'g'ri!" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Telefon Raqam"
                    name="phone"
                    
                    rules={[
                        { required: true, message: "Phone kiriting!" }                        
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Maosh"
                    name="salary"
                    rules={[{ required: true, message: "Salary kiriting!" }]}
                >
                    <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalTeachers;
