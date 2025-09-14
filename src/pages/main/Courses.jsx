import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Space, Popconfirm, Input, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useCourse from "../../hooks/useCourse";
import CourseCreateModal from "../../components/modals/courses/CourseCreate";
import CourseEditModal from "../../components/modals/courses/CourseEdit";
import TagUi from "../../components/ui/Tag";

const { Search } = Input;

const Courses = () => {
  const [branchId, setBranchId] = useState(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const storedBranchId = localStorage.getItem("branchId");
    if (storedBranchId) {
      setBranchId(Number(storedBranchId)); 
    }
  }, []);


  const { coursesQuery, deleteCourseMutation } = useCourse(branchId, { enabled: !!branchId });

  

  const filteredGroups = useMemo(() => {
    if (!coursesQuery?.data) return [];
    return coursesQuery.data.filter((g) =>
      g.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [coursesQuery?.data, search]);

  const columns = [
    { title: "Nomi", dataIndex: "name" },
    { title: "Tavsif", dataIndex: "description" },
    { title: "Narxi", dataIndex: "price", render: (price) => <TagUi>{price.toLocaleString()} so'm</TagUi> },
    { title: "Davomiyligi (oy)", dataIndex: "durationMonths", render: (duration) => `${duration} oy` },
    { title: "Filial", dataIndex: "branchName" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button
            variant="filled"
            onClick={() => {
              setSelectedCourse(record);
              setEditOpen(true);
            }}
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Kursni o'chirishni tasdiqlaysizmi?"
            onConfirm={() => deleteCourseMutation.mutate(record.id)}
          >
            <Button variant="filled" danger>
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {coursesQuery.isLoading && <p>Yuklanmoqda...</p>}
      {coursesQuery.isError && <p>Xatolik: {coursesQuery.error.message}</p>}
      {!coursesQuery.isLoading && !coursesQuery.isError && (
        <>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Kurslar</h2>
            <Space>
            <Search
              placeholder="Kurs qidirish"
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateOpen(true)}
            >
              Yangi Kurs
            </Button>
            </Space>
          </div>
  
          <Table
            dataSource={filteredGroups || []}
            columns={columns}
            rowKey="id"
          />
  
          <CourseCreateModal
            open={createOpen}
            onCancel={() => setCreateOpen(false)}
            branchId={branchId}
          />
  
          {selectedCourse && (
            <CourseEditModal
              open={editOpen}
              onCancel={() => setEditOpen(false)}
              course={selectedCourse}
              branchId={branchId}
            />
          )}
        </>
      )}
    </div>
  );
  
};

export default Courses;
