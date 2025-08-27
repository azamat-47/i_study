import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { loginMutation } = useAuth();

  const onFinish = (values) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        // Agar backenddan token kelsa
        if (data?.accessToken) {
          try {
            message.success("Muvaffaqiyatli kirdingiz!");
            navigate("/"); // Asosiy sahifaga yo'naltirish
          } catch (err) {
            console.error("LocalStorage error:", err);
            message.error("LocalStorage ga yozishda xatolik yuz berdi.");
          }
        } else {
          message.error("Token topilmadi!");
        }
      },
      onError: (err) => {
        console.error("Login error:", err);
        message.error("Login muvaffaqiyatsiz bo'ldi!");
      },
    });

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all fields correctly!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="p-8 rounded-2xl shadow-lg w-full max-w-md bg-gray-950">
        <Title level={2} className="text-center mb-6">
          Kirish
        </Title>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            hasFeedback
            rules={[
              { required: true, message: "Username to'liq kiriting!" },
              { min: 6, message: "Username kamida 6 ta harfdan iborat bo'lishi kerak!" },
            ]}
          >
            <Input placeholder="Username'ingizni kiriting" size="large" />
          </Form.Item>

          <Form.Item
            label="Parol"
            name="password"
            hasFeedback
            rules={[
              { required: true, message: "Iltimos parolni to'liq kiriting!" },
              { min: 6, message: "Parol 6 ta belgidan kam bo'lmasligi kerak!" },
            ]}
          >
            <Input.Password placeholder="Parolni kiriting" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-500 text-sm">
          Hisobingiz yo'qmi?{" "}
          <Link to="/login/register" className="text-blue-500 hover:underline">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
