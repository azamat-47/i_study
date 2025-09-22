import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Input, Space, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useStudents from "../../hooks/useStudents";
import StudentCreateModal from "../../components/modals/students/StudentCreate";
import StudentEditModal from "../../components/modals/students/StudentEdit";

const { Search } = Input;

const Students = () => {
  const [branchId, setBranchId] = useState(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedBranchId = localStorage.getItem("branchId");
    if (storedBranchId) setBranchId(Number(storedBranchId));
  }, []);

  const { studentsQuery, deleteStudentMutation } = useStudents(branchId);
  const { data, isLoading, isError, error } = studentsQuery();

  const filteredStudents = useMemo(() => {
    if (!data) return [];
    return data.filter((s) =>
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns = [
    { title: "Ism", dataIndex: "firstName" },
    { title: "Familiya", dataIndex: "lastName" },
    { title: "Telefon", dataIndex: "phoneNumber" },
    { title: "2-Telefon", dataIndex: "parentPhoneNumber" },
    { title: "Guruhlar", dataIndex: "groups", render: (groups) => groups.map(g => g.name).join(", ") },
    { title: "Filial", dataIndex: "branchName" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button variant="filled" color="cyan" onClick={() => setEditStudent(record)}>
            Tahrirlash
          </Button>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => deleteStudentMutation.mutate(record.id)}
          >
            <Button danger variant="filled">
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1 className="font-bold text-2xl">Talabalar</h1>
        <Space>
          <Search
            placeholder="Talaba qidirish"
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Talaba qo'shish
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={filteredStudents}
        columns={columns}
      />
      {isError && <div>Xatolik: {error.message}</div>}

      {/* Modal oynalar */}
      {createOpen && (
        <StudentCreateModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          branchId={branchId}
        />
      )}
      {editStudent && (
        <StudentEditModal
          open={!!editStudent}
          onClose={() => setEditStudent(null)}
          student={editStudent}
          branchId={branchId}
        />
      )}
    </div>
  );
};

export default Students;
