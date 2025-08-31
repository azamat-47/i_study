import React, { useState } from "react";
import { Button, Table, Popconfirm, Space, Tag, Input } from "antd";
import { CalendarOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import useStudents from "../../hooks/useStudents";
import AddStudentModal from "../../components/students-modal/AddStudentModal";
import EditStudentModal from "../../components/students-modal/EditStudentModal";

const Students = () => {
  const { GetStudents, DeleteStudent } = useStudents();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchText, setSearchText] = useState("");

  if (GetStudents.isLoading) return <p>Yuklanmoqda...</p>;
  if (GetStudents.isError) return <p>Xatolik: {GetStudents.error.message}</p>;

  const students = GetStudents.data.map((student) => ({
    ...student,
    key: student.id,
    courses: student.courses.map((course) => course.name),
  }));

  // 🔎 Faqat ism bo‘yicha filter
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Ismi", dataIndex: "name", key: "name" },
    { title: "Telefon", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Kurslar",
      dataIndex: "courses",
      key: "courses",
      render: (courses) => courses.join(", "),
    },
    {
      title: "Ro'yxatdan o'tgan sana",
      dataIndex: "enrollmentDate",
      key: "enrollmentDate",
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: "#faad14" }} />
          <Tag color="blue">{date}</Tag>
        </Space>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedStudent(record);
              setEditModalVisible(true);
            }}
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="O‘chirishni tasdiqlaysizmi?"
            onConfirm={() => DeleteStudent.mutate(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button danger type="primary">
              O‘chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold">Talabalar</h2>

        <div className="flex gap-4">
          {/* 🔎 Search input */}
          <Input
            placeholder="Talabalarni qidirish... (ism bo‘yicha)"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 280 }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
          >
            Yangi qo'shish
          </Button>
        </div>
      </div>

      <Table dataSource={filteredStudents} columns={columns} rowKey="id" />

      {/* Add Modal */}
      <AddStudentModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
      />

      {/* Edit Modal */}
      {selectedStudent && (
        <EditStudentModal
          visible={isEditModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
        />
      )}
    </div>
  );
};

export default Students;
