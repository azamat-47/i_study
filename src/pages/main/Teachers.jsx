// TeachersPage.js
import React, { useState } from "react";
import { Button, Table, Space } from "antd";
import useTeacher from "../../hooks/useTeacher";
import ModalTeachers from "../../components/ModalTeachers";

const TeachersPage = () => {
    const { getTeachers, deleteTeacherMutation } = useTeacher();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    if (getTeachers.isLoading) return <p>Loading...</p>;
    if (getTeachers.isError) return <p>Error: {getTeachers.error.message}</p>;

    const columns = [
        // { title: "Username", dataIndex: "username", key: "username" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Salary", dataIndex: "salary", key: "salary" },
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
                        Edit
                    </Button>
                    <Button
                        danger
                        onClick={() => deleteTeacherMutation.mutate(record.id)}
                    >
                        Delete
                    </Button>
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
                Add Teacher
            </Button>

            <Table
                dataSource={getTeachers.data}
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
