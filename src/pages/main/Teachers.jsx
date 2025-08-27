// TeachersPage.js
import React, { useState } from "react";
import { Button, Table, Space, Popconfirm } from "antd";
import useTeacher from "../../hooks/useTeacher";
import ModalTeachers from "../../components/teacher-modal/ModalTeachers";
import ModalTeaEdit from "../../components/teacher-modal/ModalTeaEdit";

const TeachersPage = () => {
    const { getTeachers, deleteTeacherMutation } = useTeacher();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    if (getTeachers.isLoading) return <p>Yuklanmoqda...</p>;
    if (getTeachers.isError) return <p>Error: {getTeachers.error.message}</p>;

    const teachers = getTeachers.data.map((item) => (
        { 
            key: item.user.id,        // yoki id bo‘lmasa username unique bo‘lsin
            username: item.user.username,
            name: item.name,
            email: item.email,
            phone: item.phone,
            salary: item.salary
          }
    ))

    console.log("Mapped Teachers:", teachers);
    
    const columns = [
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Ism", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Telefon", dataIndex: "phone", key: "phone" },
        { title: "Maosh", dataIndex: "salary", key: "salary" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            setSelectedTeacher(record);
                            setModalVisible(true);
                        }}
                    >
                        O'zgartirish
                    </Button>
                    <Popconfirm
                        title="Rostdan ham uchirishni holaysizmi?"
                        onConfirm={() => deleteTeacherMutation.mutate(record.key)}
                        okText="Ha"
                        cancelText="Yo"
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
                    setSelectedTeacher(null); // Add rejimi uchun
                    setModalVisible(true);
                }}
            >
                Yangi Ustoz qo'shish
            </Button>

            {/* Edit teacher modal */}
            {selectedTeacher && (
                <ModalTeaEdit
                    visible={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedTeacher(null);
                    }}
                    teacher={selectedTeacher}
                />
            )}

            <Table
                dataSource={teachers}
                columns={columns}
                rowKey="id"
            />

            <ModalTeachers
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                teacher={selectedTeacher}
            />
        </div>
    );
};

export default TeachersPage;
