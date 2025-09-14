import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Space, Popconfirm, Input, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useTeacher from "../../hooks/useTeacher";
import TeacherCreateModal from "../../components/modals/teachers/TeacherCreate";
import TeacherEditModal from "../../components/modals/teachers/TeacherEdit";
import TagUi from "../../components/ui/Tag";

const { Search } = Input;

const Teachers = () => {
  const [branchId, setBranchId] = useState(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const storedBranchId = localStorage.getItem("branchId");
    if (storedBranchId) {
      setBranchId(Number(storedBranchId));
    }
  }, []);

  const { teachersQuery, deleteTeacherMutation } = useTeacher(branchId);

  const filteredTeachers = useMemo(() => {
    if (!teachersQuery?.data) return [];
    return teachersQuery.data.filter((t) =>
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [teachersQuery?.data, search]);

  const columns = [
    { title: "Ism", dataIndex: "firstName" },
    { title: "Familiya", dataIndex: "lastName" },
    { title: "Telefon", dataIndex: "phoneNumber" },
    { title: "Maosh turi", dataIndex: "salaryType", render: (val) => <Tag color="blue">{val}</Tag> },
    { 
      title: "Maosh", 
      render: (record) => 
        record.salaryType === "FIXED"
          ? <TagUi color="green">{record.baseSalary?.toLocaleString()} so'm</TagUi>
          : <TagUi color="magenta">{record.paymentPercentage}%</TagUi>
    },
    { title: "Filial", dataIndex: "branchName" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedTeacher(record);
              setEditOpen(true);
            }}
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="O'qituvchini o'chirishni tasdiqlaysizmi?"
            onConfirm={() => deleteTeacherMutation.mutate(record.id)}
          >
            <Button danger>O'chirish</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {teachersQuery.isLoading && <p>Yuklanmoqda...</p>}
      {teachersQuery.isError && <p>Xatolik: {teachersQuery.error.message}</p>}
      {!teachersQuery.isLoading && !teachersQuery.isError && (
        <>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">O'qituvchilar</h2>
            <Space>
              <Search
                placeholder="Ism yoki familiya bo‘yicha qidirish"
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 300 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateOpen(true)}
              >
                Yangi O'qituvchi
              </Button>
            </Space>
          </div>

          <Table
            dataSource={filteredTeachers || []}
            columns={columns}
            rowKey="id"
          />

          <TeacherCreateModal
            open={createOpen}
            onCancel={() => setCreateOpen(false)}
            branchId={branchId}
          />

          {selectedTeacher && (
            <TeacherEditModal
              open={editOpen}
              onCancel={() => setEditOpen(false)}
              teacher={selectedTeacher}
              branchId={branchId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Teachers;
