// import React, { useEffect } from "react";
// import { Modal, Form, Input, InputNumber, Button } from "antd";
// import useTeacher from "../../hooks/useTeacher";

// const ModalTeaEdit = ({ visible, onClose, teacher }) => {
//   const [form] = Form.useForm();
//   const { updateTeacherMutation } = useTeacher();


//   useEffect(() => {
//     if (teacher) {
//       form.setFieldsValue({
//         username: teacher.username,
//         name: teacher.name,
//         email: teacher.email,
//         phone: teacher.phone,
//         salary: teacher.salary,
//         password: "", // password bo‘sh boshlanishi
//       });
//     }
//   }, [teacher, form]);

//   const handleFinish = (values) => {
//     const payload = {
//       id: teacher.key,
//       userId: teacher.key,
//       username: values.username,
//       name: values.name,
//       email: values.email,
//       phone: values.phone,
//       salary: values.salary
//     };

//     // password faqat kiritilgan bo‘lsa yuborilsin
//     if (values.password) {
//       payload.user.password = values.password;
//     }

//     console.log("Update Payload:", payload);
//     updateTeacherMutation.mutate(payload, { onSuccess: () => {onClose(), form.resetFields() } });
//   };

//   return (
//     <Modal
//       title="Teacher ma'lumotlarini tahrirlash"
//       open={visible}
//       onCancel={onClose}
//       footer={[
//         <Button key="cancel" onClick={onClose}>
//           Bekor qilish
//         </Button>,
//         <Button key="submit" type="primary" onClick={() => form.submit()}>
//           Saqlash
//         </Button>,
//       ]}
//     >
//       <Form form={form} layout="vertical" onFinish={handleFinish}>
//         <Form.Item
//           label="Username"
//           name="username"
//         // rules={[
//         //   { required: true, message: "Username kiriting!" },
//         //   { min: 6, message: "Username kamida 6 belgidan bo‘lishi kerak!" },
//         // ]}
//         >
//           <Input disabled />
//         </Form.Item>

//         <Form.Item
//           label="Yangi Parol"
//           name="password"
//           rules={[
//             { min: 6, message: "Password kamida 6 belgidan bo‘lishi kerak!" },
//           ]}
//         >
//           <Input.Password placeholder="Yangi parol (agar o‘zgartirilsa)" />
//         </Form.Item>

//         <Form.Item
//           label="Ism"
//           name="name"
//           rules={[{ required: true, message: "Name kiriting!" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Email"
//           name="email"
//           rules={[{ required: true, message: "Email kiriting!" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Phone"
//           name="phone"
//           rules={[{ required: true, message: "Phone kiriting!" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Maosh"
//           name="salary"
//           rules={[{ required: true, message: "Maosh kiriting!" }]}
//         >
//           <InputNumber
//             style={{ width: "100%" }}
//             min={0}
//             formatter={(value) =>
//               `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
//             }
//             parser={(value) => value.replace(/\s/g, "")}
//           />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default ModalTeaEdit;


import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import useTeacher from "../../hooks/useTeacher";

const ModalTeaEdit = ({ visible, onClose, teacher }) => {
  const [form] = Form.useForm();
  const { updateTeacherMutation } = useTeacher();

  useEffect(() => {
    if (teacher) {
      form.setFieldsValue({
        username: teacher.username,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        salary: teacher.salary,
        password: "", // password bo'sh boshlanishi
      });
    }
  }, [teacher, form]);

  const handleFinish = (values) => {
    const payload = {
      id: teacher.key,
      userId: teacher.key,
      username: values.username,
      name: values.name,
      email: values.email,
      phone: values.phone,
      salary: values.salary,
      user: {} // user obyekti yaratish
    };

    // password faqat kiritilgan bo'lsa yuborilsin
    if (values.password && values.password.trim()) {
      payload.user.password = values.password;
    }

    console.log("Update Payload:", payload);
    updateTeacherMutation.mutate(payload, { 
      onSuccess: () => {
        onClose();
        form.resetFields();
      }
    });
  };

  return (
    <Modal
      title="Teacher ma'lumotlarini tahrirlash"
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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Username kiriting!" },
            { min: 6, message: "Username kamida 6 belgidan bo'lishi kerak!" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Yangi Parol"
          name="password"
          rules={[
            { min: 6, message: "Password kamida 6 belgidan bo'lishi kerak!" },
          ]}
        >
          <Input.Password placeholder="Yangi parol (agar o'zgartirilsa)" />
        </Form.Item>

        <Form.Item
          label="Ism"
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
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone kiriting!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Maosh"
          name="salary"
          rules={[{ required: true, message: "Maosh kiriting!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }
            parser={(value) => value.replace(/\s/g, "")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalTeaEdit;