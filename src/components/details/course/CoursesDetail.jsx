import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Typography, Popconfirm, Input, DatePicker, Modal } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons"; // UserOutlined ikonasini qo'shamiz
import dayjs from "dayjs";
import { useCourse } from "../../../hooks/useCourse";
import GroupCreateModal from "../../modals/groups/GroupCreateModal";
import GroupEditModal from "../../modals/groups/GroupEditModal";
import { AiOutlineSwapLeft } from "react-icons/ai";

const { Title } = Typography;
const { Search } = Input;
const { MonthPicker } = DatePicker; // MonthPicker ni import qilamiz

const StudentsListModal = ({ open, onClose, students, groupName, coursePrice }) => {
  const studentColumns = [
    { title: "Ismi", dataIndex: "studentName" },
    { title: "Telefon", dataIndex: "phoneNumber" },
    { title: "Ota-ona telefon", dataIndex: "parentPhoneNumber" },
    { title: "To'langan summa", dataIndex: "totalPaidInMonth", render: (text) => `${text} so'm` },
    { title: "Qarz (qolgan)", dataIndex: "remainingAmount", render: (text) => `${text} so'm` },
    { title: "Holat", dataIndex: "paymentStatus" },
  ];

  return (
    <Modal
      title={`${groupName} guruhining o'quvchilari (${dayjs().format('MMMM YYYY')})`} // Dinamik sarlavha
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <p><strong>Kurs narxi:</strong> {coursePrice} so'm</p>
      <Table
        dataSource={students}
        columns={studentColumns}
        rowKey="studentId"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Modal>
  );
};


const CoursesDetail = () => {
  const { id: courseId } = useParams();
  const branchId = localStorage.getItem("branchId");
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [search, setSearch] = useState("");

  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [selectedGroupStudents, setSelectedGroupStudents] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGroupCoursePrice, setSelectedGroupCoursePrice] = useState(0);


  const {
    courseByIdQuery,
    groupsByCourseQuery,
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
  } = useCourse(branchId);

  // Kurs ma'lumotlarini olish
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
  } = courseByIdQuery(courseId);

  // Guruhlarni courseId, yil va oy bo'yicha olish
  const {
    data: groupsData,
    isLoading: isGroupsLoading,
    isError: isGroupsError,
    error: groupsError,
    refetch: refetchGroups,
  } = groupsByCourseQuery(courseId); // Oy 0 dan boshlanadi, shuning uchun +1

  // Guruhlar ro'yxatini qidirish bo'yicha filtrlash
  const filteredGroups = useMemo(() => {
    if (!groupsData) return [];
    return groupsData.filter((g) =>
      g.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [groupsData, search]);

  // Guruhni o'chirishni tasdiqlash funksiyasi
  const handleDeleteGroup = (groupId) => {
    deleteGroupMutation.mutate(groupId, {
      onSuccess: () => {
        refetchGroups();
        courseByIdQuery(courseId).refetch();
      },
    });
  };

  // "O'quvchilar" tugmasini bosganda modalni ochish
  const handleViewStudents = (group) => {
    setSelectedGroupStudents(group.studentPayments || []);
    setSelectedGroupName(group.name);
    setSelectedGroupCoursePrice(group.studentPayments?.[0]?.coursePrice || 0); // Guruhdagi birinchi o'quvchining kurs narxini olamiz
    setStudentsModalOpen(true);
  };

  // Guruhlar jadvali uchun ustunlar
  const columns = [
    { title: "Nomi", dataIndex: "name" },
    { title: "Kurs", dataIndex: "courseName" }, // Add courseName column
    { title: "O'qituvchi", dataIndex: "teacherName" },
    { title: "Boshlanish", dataIndex: "startTime" },
    { title: "Tugash", dataIndex: "endTime" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button variant="filled" onClick={() => navigate(`/groups/${record.id}`)}>Ko'rish</Button>
          <Button type="default" onClick={() => setEditGroup(record)}>Tahrirlash</Button>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDeleteGroup(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger>O'chirish</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isCourseLoading) return <h1>Kurs ma'lumotlari yuklanmoqda....</h1>;
  if (isCourseError) return <h1>Kurs ma'lumotlarini yuklashda xatolik: {courseError.message}</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <Button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
        icon={<AiOutlineSwapLeft />}
      >
        Orqaga
      </Button>
      <Title level={2}>{courseData?.name || "Kurs ma'lumotlari"}</Title>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>Kurs nomi:</strong> {courseData?.name}</p>
        <p><strong>Davomiylik:</strong> {courseData?.durationMonths} oy</p>
        <p><strong>Tavsifi:</strong> {courseData?.description || "Tavsif yo'q"}</p>
        <p><strong>Yaratilgan sana:</strong> {dayjs(courseData?.createdAt).format("YYYY-MM-DD")}</p>
        <p><strong>Guruhlar soni:</strong> {filteredGroups?.length || 0} ta</p>
      </div>

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={4} style={{ margin: 0 }}>Guruhlar ro'yxati</Title>
        <Space>
          <Search
            placeholder="Guruh qidirish"
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary" onClick={() => setCreateOpen(true)} icon={<PlusOutlined />}>
            Guruh qo'shish
          </Button>
        </Space>
      </div>

      {isGroupsError && <div>Guruhlarni yuklashda xatolik: {groupsError.message}</div>}

      <Table
        columns={columns}
        dataSource={filteredGroups}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} guruh`,
        }}
        loading={isGroupsLoading || deleteGroupMutation.isLoading}
      />

      {createOpen && (
        <GroupCreateModal
          open={createOpen}
          onClose={() => {
            setCreateOpen(false);
            refetchGroups();
            courseByIdQuery(courseId).refetch();
          }}
          branchId={branchId}
          courseId={courseId}
          createGroupMutation={createGroupMutation}
        />
      )}
      {editGroup && (
        <GroupEditModal
          open={!!editGroup}
          onClose={() => {
            setEditGroup(null);
            refetchGroups();
            courseByIdQuery(courseId).refetch();
          }}
          group={editGroup}
          branchId={branchId}
          updateGroupMutation={updateGroupMutation}
        />
      )}

      {/* O'quvchilar ro'yxati modali */}
      <StudentsListModal
        open={studentsModalOpen}
        onClose={() => setStudentsModalOpen(false)}
        students={selectedGroupStudents}
        groupName={selectedGroupName}
        coursePrice={selectedGroupCoursePrice}
      />
    </div>
  );
};

export default CoursesDetail;