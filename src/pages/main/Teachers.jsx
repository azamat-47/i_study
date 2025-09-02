import React, { useState } from "react";
import { Button, Table, Space, Popconfirm, Input, Tag } from "antd";
import { DollarOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import useTeacher from "../../hooks/useTeacher";
import ModalTeachers from "../../components/teacher-modal/ModalTeachers";
import ModalTeaEdit from "../../components/teacher-modal/ModalTeaEdit";

const TeachersPage = () => {
    const { getTeachers, deleteTeacherMutation } = useTeacher();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchText, setSearchText] = useState("");

    if (getTeachers.isLoading) return <p>Yuklanmoqda...</p>;
    if (getTeachers.isError) return <p>Error: {getTeachers.error.message}</p>;

    const teachers = getTeachers.data.map((item) => (
        {
            key: item.user.id,        // yoki id bo‘lmasa username unique bo‘lsin
            username: item.user.username,
            name: item.name,
            email: item.email,
            phone: item.phone,
            salary: item.salary,
            courses: item.courses.map((course) => course.name).join(", "), // kurs nomlarini olish va vergul bilan ajratish
        }
    ))
    
    const filterTeachers = teachers.filter((teacher) =>{
        const search = searchText.toLowerCase();
        return teacher.name.toLowerCase().includes(search) 
    })

    const columns = [
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Ism", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Telefon", dataIndex: "phone", key: "phone" },
        { 
            title: "Kurslari", 
            dataIndex: "courses", 
            key: "courses",
           
        },
        
        {
            title: "Maosh", dataIndex: "salary", key: "salary",
            render: (fee) => (
                <Space>
                    <DollarOutlined style={{ color: '#fa8c16' }} />
                    <Tag color="cyan">{fee?.toLocaleString()} so'm</Tag>
                </Space>
            ),
        },
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
            <div className="flex justify-between mb-4 gap-4">
                <h2 className="text-xl font-bold">Ustozlar</h2>

                <div className="flex gap-5">

                    {/* 🔎 Search input */}
                    <Input
                            placeholder="Ustozlarni qidirish... {ism}"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            style={{ width: 300, marginBottom: 16 }}
                            
                        />
                    <Button
                        type="primary"
                        style={{ marginBottom: 16 }}
                        onClick={() => {
                            setSelectedTeacher(null); // Add rejimi uchun
                            setModalVisible(true);
                        }}
                        icon={<PlusOutlined />}
                    >
                        Yangi Ustoz qo'shish
                    </Button>
                </div>
            </div>

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
                dataSource={filterTeachers}
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
