import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Input, Popconfirm, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCourse } from "../../hooks/useCourse";
import { useNavigate } from "react-router-dom";
import GroupCreateModal from "../../components/modals/groups/GroupCreateModal";
import GroupEditModal from "../../components/modals/groups/GroupEditModal";

const { Search } = Input;

const Groups = () => {
  const [branchId, setBranchId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // LocalStorage dan branchId olish
  useEffect(() => {
    const storedBranchId = localStorage.getItem("branchId");
    if (storedBranchId) {
      setBranchId(Number(storedBranchId));
    }
  }, []);

  // useGroups faqat branchId bo‘lganda ishga tushadi
  const { groupsQuery, deleteGroupMutation } = useCourse(branchId, {
    enabled: !!branchId,
  });

  const filteredGroups = useMemo(() => {
    if (!groupsQuery?.data) return [];
    return groupsQuery.data.filter((g) =>
      g.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [groupsQuery?.data, search]);

  const columns = [
    { title: "Nomi", dataIndex: "name" },
    { title: "Kurs", dataIndex: "courseName" },
    { title: "O'qituvchi", dataIndex: "teacherName" },
    { title: "Boshlanish", dataIndex: "startTime" },
    { title: "Tugash", dataIndex: "endTime" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button variant="filled" color="blue" onClick={() => navigate(`/groups/${record.id}`)}>Ko'rish</Button>
          <Button variant="filled" color="cyan"  onClick={() => setEditGroup(record)}>Tahrirlash</Button>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => deleteGroupMutation.mutate(record.id)}
          >
            <Button variant="filled" danger>O'chirish</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {groupsQuery.isLoading && <div>Yuklanmoqda...</div>}
      {groupsQuery.isError && <div>Xatolik yuz berdi: {groupsQuery.error.message}</div>}
      {!groupsQuery.isLoading && !groupsQuery.isError && (
        <>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <h1 className="font-bold text-2xl">Guruhlar</h1>
            <Space>
            <Search placeholder="Guruh qidirish" onChange={(e) => setSearch(e.target.value)} style={{ width: 300 }} />
            <Button type="primary" onClick={() => setCreateOpen(true)} icon={<PlusOutlined />}>Guruh qo'shish</Button>
            </Space>
          </div>
          <Table rowKey="id" loading={groupsQuery?.isLoading} dataSource={filteredGroups} columns={columns} />
          {createOpen && <GroupCreateModal open={createOpen} onClose={() => setCreateOpen(false)} branchId={branchId} />}
          {editGroup && <GroupEditModal open={!!editGroup} onClose={() => setEditGroup(null)} group={editGroup} branchId={branchId} />}

        </>
      )
      }
    </div>
  );
};

export default Groups;
