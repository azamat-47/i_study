// src/pages/Groups/GroupDetail.jsx
import React from "react";
import { Button, Card, Descriptions } from "antd";
import { useParams } from "react-router-dom";
import {useGroups}  from "../../../hooks/useGroups";
import { useNavigate } from "react-router-dom";
import { AiOutlineSwapLeft } from "react-icons/ai";

const GroupDetail = () => {
  const { id } = useParams();
  const branchId = localStorage.getItem("branchId");
  const { groupByIdQuery } = useGroups(branchId);
  const { data, isLoading } = groupByIdQuery(id);
  const navigate = useNavigate();

  if (isLoading) return <p>Yuklanmoqda...</p>;

  return (
    <>
    {/* back to button */}
    <Button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }} icon={<AiOutlineSwapLeft />}>
      Orqaga
    </Button>
    <Card title="Guruh ma'lumotlari">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Nomi">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Kurs">{data.courseName}</Descriptions.Item>
        <Descriptions.Item label="O'qituvchi">{data.teacherName}</Descriptions.Item>
        <Descriptions.Item label="Boshlanish">{data.startTime}</Descriptions.Item>
        <Descriptions.Item label="Tugash">{data.endTime}</Descriptions.Item>
        <Descriptions.Item label="Filial">{data.branchId}</Descriptions.Item>
      </Descriptions>
    </Card>
    </>
  );
};

export default GroupDetail;
