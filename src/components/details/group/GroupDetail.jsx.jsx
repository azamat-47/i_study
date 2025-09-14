// src/pages/Groups/GroupDetail.jsx
import React from "react";
import { Card, Descriptions } from "antd";
import { useParams } from "react-router-dom";
import {useGroups}  from "../../../hooks/useGroups";

const GroupDetail = () => {
  const { id } = useParams();
  const branchId = localStorage.getItem("branchId");
  const { groupByIdQuery } = useGroups(branchId);
  const { data, isLoading } = groupByIdQuery(id);

  if (isLoading) return <p>Yuklanmoqda...</p>;

  return (
    <Card title="Guruh ma'lumotlari">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Nomi">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Kurs">{data.courseId}</Descriptions.Item>
        <Descriptions.Item label="O'qituvchi">{data.teacherId}</Descriptions.Item>
        <Descriptions.Item label="Boshlanish">{data.startTime}</Descriptions.Item>
        <Descriptions.Item label="Tugash">{data.endTime}</Descriptions.Item>
        <Descriptions.Item label="Filial">{data.branchId}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default GroupDetail;
