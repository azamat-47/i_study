import React, { useState, useMemo } from "react";
import {
  Button,
  Card,
  Descriptions,
  DatePicker,
  Space,
  Table,
  Typography,
  Popconfirm,
  Modal,
  Select,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../../../hooks/useCourse";
import { AiOutlineSwapLeft } from "react-icons/ai";
import dayjs from "dayjs";

// Modal component
import StudentCreateModal from "../../modals/students/StudentCreate";
import AddExistingStudentModal from "../../modals/students/AddExistingStudentModal";

const { Title } = Typography;

const GroupDetail = () => {
  const { id } = useParams();
  const branchId = localStorage.getItem("branchId");
  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // joriy oy default
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);

  const navigate = useNavigate();

  const { groupByIdQuery, removeStudentFromGroupMutation } = useCourse(branchId);

  const {
    data,
    isLoading,
    isError,
    error,
  } = groupByIdQuery(
    id,
    selectedMonth?.year() ?? dayjs().year(),
    (selectedMonth?.month() ?? dayjs().month()) + 1
  );

  const students = useMemo(() => data?.studentPayments || [], [data]);
  const groupName = data?.name || "Noma'lum guruh";
  const coursePrice = data?.coursePrice ?? students?.[0]?.coursePrice ?? 0;

  const handleDelete = (studentId) => {
    // agar guruhdan chiqarish kerak bo‘lsa shu mutatsiyani ishlatish mumkin
    removeStudentFromGroupMutation.mutate({ groupId: id, studentId });
  };

  const studentColumns = [
    { title: "Ismi", dataIndex: "studentName" },
    { title: "Telefon", dataIndex: "phoneNumber" },
    {
      title: "To'langan summa",
      dataIndex: "totalPaidInMonth",
      render: (text) => `${text} so'm`,
    },
    {
      title: "Qarz (qolgan)",
      dataIndex: "remainingAmount",
      render: (text) => `${text} so'm`,
    },
    { title: "Holat", dataIndex: "paymentStatus" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Popconfirm
          title="Haqiqatan ham guruhdan o‘chirmoqchimisiz?"
          onConfirm={() => handleDelete(record.studentId)}
        >
          <Button danger>O‘chirish</Button>
        </Popconfirm>
      ),
    },
  ];

 
  if (isLoading) return <p>Yuklanmoqda...</p>;
  if (isError)
    return (
      <p>
        Xatolik yuz berdi: {error?.message || String(error) || "Noma'lum xato"}
      </p>
    );

  return (
    <>
      <Button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
        icon={<AiOutlineSwapLeft />}
      >
        Orqaga
      </Button>

      <Card title="Guruh ma'lumotlari" style={{ marginBottom: "20px" }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Nomi">{data.name}</Descriptions.Item>
          <Descriptions.Item label="Kurs">{data.courseName}</Descriptions.Item>
          <Descriptions.Item label="O'qituvchi">
            {data.teacherName}
          </Descriptions.Item>
          <Descriptions.Item label="Boshlanish">
            {data.startTime}
          </Descriptions.Item>
          <Descriptions.Item label="Tugash">
            {data.endTime}
          </Descriptions.Item>
          <Descriptions.Item label="Filial">
            {data.branchName}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="O'quvchilar ro'yxati va to'lov holati">
        <Space style={{ marginBottom: "16px" }}>
          <DatePicker
            picker="month"
            onChange={(date) => setSelectedMonth(date)}
            value={selectedMonth}
            placeholder="Oyni tanlang"
            format="YYYY-MM"
          />
          <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
            Yangi Talaba Qo‘shish
          </Button>
          <Button onClick={() => setIsAddExistingOpen(true)}>
            Mavjud Talabani Qo‘shish
          </Button>
        </Space>

        <Table
          dataSource={students}
          columns={studentColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Student create modal */}
      <StudentCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        branchId={branchId}
        group={{ id, name: groupName }}
      />

      <AddExistingStudentModal
        open={isAddExistingOpen}
        onClose={() => setIsAddExistingOpen(false)}
        branchId={branchId}
        groupId={id}
        groupStudents={students} 
      />
    </>
  );
};

export default GroupDetail;
