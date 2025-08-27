import React, { useState } from "react";
import { Button, Table, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useStudents from "../../hooks/useStudents";
import AddStudentModal from "../../components/students-modal/AddStudentModal";
import EditStudentModal from "../../components/students-modal/EditStudentModal";

const Students = () => {
  const { GetStudents, DeleteStudent } = useStudents();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  

  if (GetStudents.isLoading) return <p>Yuklanmoqda...</p>;
  if (GetStudents.isError) return <p>Xatolik: {GetStudents.error.message}</p>;

  const columns = [
    { title: "Ismi", dataIndex: "name", key: "name" },
    { title: "Telefon", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Kurslar", dataIndex: "courses", key: "courses", render: (courses) => courses.join(", ") },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setSelectedStudent(record);
              setEditModalVisible(true);
            }}
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => DeleteStudent.mutate(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger type="link">O'chirish</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Talabalar</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
          Yangi qo'shish
        </Button>
      </div>

      <Table dataSource={GetStudents.data || []} columns={columns} rowKey="id" />

      {/* Add Modal */}
      <AddStudentModal visible={isAddModalVisible} onClose={() => setAddModalVisible(false)} />

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
