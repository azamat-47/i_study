// Main.jsx
import React, { useState } from "react";
import { Button, Table, Space, Popconfirm, Tooltip, Tag } from "antd";
import useCourse from "../../hooks/useCourse";
import CreateCourseModal from "../../components/course-modal/CreateCourseModal";
import UpdateCourseModal from "../../components/course-modal/UpdateCourseModal";
import { DollarOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router";

const Main = () => {
  const { getCourses, deleteCourseMutation } = useCourse();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);


  if (getCourses.isLoading) return <p>Loading...</p>;
  if (getCourses.isError) return <p>Error: {getCourses.error.message}</p>;

  console.log("Courses:", getCourses.data);




  const columns = [
    {
      title: "Kurs nomi", dataIndex: "name", key: "name",
      render: (name, record) => (
        <Tooltip title="Kurs sahifasiga o'tish">
          <Link to={`/kurs/${record.id}`}>{name}</Link>
        </Tooltip>
      )
    },
    { title: "Ta'rif", dataIndex: "description", key: "description" },
    {
      title: "Narxi (fee)", dataIndex: "fee", key: "fee",
      render: (fee) => (
        <Space>
          <DollarOutlined style={{ color: '#fa8c16' }} />
          <Tag color="cyan">{fee?.toLocaleString()} so'm</Tag>
        </Space>
      ),
    },
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
            O'zgartirish
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
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Guruhlar</h2>
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => {
            setSelectedCourse(null); // yangi kurs qo'shish rejimi
            setModalVisible(true);
          }}
          icon={<PlusOutlined />}
        >
          Yangi Kurs qo'shish
        </Button>
      </div>

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
