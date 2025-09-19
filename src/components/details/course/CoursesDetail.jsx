import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Typography, Popconfirm } from "antd";
import dayjs from "dayjs";
import {useCourse} from "../../../hooks/useCourse";

const { Title } = Typography;

const CoursesDetail = () => {
  const { id } = useParams();
  const branchId = localStorage.getItem("branchId");
  const { courseByIdQuery } = useCourse(branchId);
  const { data, isLoading } = courseByIdQuery(id);

  const navigate = useNavigate()

  if (isLoading) return <h1>Yuklanmoqda....</h1>;

  // Guruhlar jadvali uchun ustunlar
  const columns = [
    { title: "Nomi", dataIndex: "name" },
    { title: "O'qituvchi", dataIndex: "teacherName" },
    { title: "Boshlanish", dataIndex: "startTime" },
    { title: "Tugash", dataIndex: "endTime" },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button variant="filled" color="blue" onClick={() => navigate(`/groups/${record.id}`)}>Ko'rish</Button>
          
        </Space>
      ),
    },
  ];


  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>{data?.name || "Kurs ma'lumotlari"}</Title>
      
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Kurs nomi:</strong> {data?.name}</p>
        <p><strong>Davomiylik:</strong> {data?.durationMonths}</p>
        <p><strong>Tavsifi:</strong> {data?.description || "Tavsif yuq"}</p>
        <p><strong>Kurs nomi:</strong> {dayjs(data?.createdAt).format("YYYY-MM-DD")}</p>
        <p><strong>Guruhlar soni:</strong> {data?.groups?.length || 0} ta</p>
      </div>

      <Table
        columns={columns}
        dataSource={data?.groups || []}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} guruh`,
        }}
        loading={isLoading}
        
      />
    </div>
  );
};

export default CoursesDetail;