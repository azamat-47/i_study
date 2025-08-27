// Main.jsx
import React, { useState } from "react";
import { Button, Table, Space, Popconfirm } from "antd";
import useCourse from "../../hooks/useCourse";
import CreateCourseModal from "../../components/course-modal/CreateCourseModal";
import UpdateCourseModal from "../../components/course-modal/UpdateCourseModal";

const Main = () => {
  const { getCourses, deleteCourseMutation, getStudentsByCourseId } = useCourse();
const [modalVisible, setModalVisible] = useState(false);
const [selectedCourse, setSelectedCourse] = useState(null);

// Avval query chaqirib qo‘yamiz
const studentsQuery = getStudentsByCourseId(10);

if (getCourses.isLoading || studentsQuery.isLoading) return <p>Yuklanmoqda...</p>;
if (getCourses.isError) return <p>Error: {getCourses.error.message}</p>;
if (studentsQuery.isError) return <p>Error: {studentsQuery.error.message}</p>;

console.log("Courses:", getCourses.data);
console.log("Students by Course ID:", studentsQuery.data);
  
  

  
  const columns = [
    { title: "Kurs nomi", dataIndex: "name", key: "name" },
    { title: "Ta'rif", dataIndex: "description", key: "description" },
    { title: "Narxi (fee)", dataIndex: "fee", key: "fee" },
    {
      title: "Ustoz",
      key: "teachers",
      render: (_, record) =>
        record.teachers?.map((t) => t.name).join(", ") || "Ustoz belgilanmagan",
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedCourse(record);
              setModalVisible(true);
            }}
          >
            O‘zgartirish
          </Button>
          <Popconfirm
            title="Haqiqatan ham o'chirmoqchimisiz?"
            onConfirm={() => deleteCourseMutation.mutate(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger>O'chirish</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setSelectedCourse(null); // yangi kurs qo‘shish rejimi
          setModalVisible(true);
        }}
      >
        Yangi Kurs qo‘shish
      </Button>

      {/* Update modal */}
      {selectedCourse && (
        <UpdateCourseModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
        />
      )}

      <Table
        dataSource={getCourses.data}
        columns={columns}
        rowKey="id"
      />

      {/* Create modal */}
      <CreateCourseModal
        visible={modalVisible && !selectedCourse}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default Main;
