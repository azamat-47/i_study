import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

const Register = () => {
  const onFinish = (values) => {
    console.log("Register data:", values);
    message.success("Account created successfully!");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all fields correctly!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Ro'yxatdan o'tish
        </Title>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Iltimos isimni to'liq kiriting!" }]}
          >
            <Input placeholder="Ismingiz kiriting"  size="large" />
          </Form.Item>

          
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Iltimos username to'liq kiriting!" },
              { min: 6, message: "Username eng kami bilan 6 ta harfdan iborat bulishi kerak!" },
            ]}
          >
            <Input placeholder="Username'ni kiriting" size="large" />
          </Form.Item>

          
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Iltimos emailni to'liq kiriting!" },
              { type: "email", message: "To'g'ri email kiriting!" },
            ]}
          >
            <Input placeholder="Emailni kiriting" size="large" />
          </Form.Item>

          
          <Form.Item
            label="Parol"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Parol 6 ta belgidan kam bo'lmasligi kerak!" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Parol kiriting" size="large" />
          </Form.Item>

          
          <Form.Item
            label="Parolni tasdiqlang"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Parolni to'liq kiriting!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Parollar bir xil emas!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Parolni qayta kiriting" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-500 hover:bg-green-600"
              size="large"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-500 text-sm">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
