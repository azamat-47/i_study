import React from "react";
import { Button, Descriptions, Table, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import useStudents from "../../../hooks/useStudents";
import dayjs from "dayjs";
import TagUi from "../../ui/Tag";
import { AiOutlineSwapLeft } from "react-icons/ai";

const StudentDetail = () => {
    const { id } = useParams();
    const branchId = Number(localStorage.getItem("branchId"));
    const { studentByIdQuery, studentPaymentHistoryQuery } = useStudents(branchId);
    const navigate = useNavigate();

    const { data: student, isLoading } = studentByIdQuery(id);
    const { data: payments } = studentPaymentHistoryQuery(id);

    const columns = [
        {
            title: "Sana",
            dataIndex: "createdAt",
            render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Kurs",
            dataIndex: "courseName",
        },
        {
            title: "Summa",
            dataIndex: "amount",
            render: (val) =>
                <TagUi color="blue">{val?.toLocaleString("uz-UZ")}</TagUi>,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => {
                const color = status === "COMPLETED" ? "green" : "volcano";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Izoh",
            dataIndex: "description",
        },
    ];

    if (isLoading) return <div>Yuklanmoqda...</div>;

    return (
        <div>
            <Button icon={<AiOutlineSwapLeft />} onClick={() => navigate(-1)} className="mb-4">
                Ortga
            </Button>
            <h1 className="text-2xl font-bold mb-4">
                {student.firstName} {student.lastName}
            </h1>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Telefon">
                    {student.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Filial">
                    {student.branchName}
                </Descriptions.Item>
            </Descriptions>

            <h2 className="text-xl font-semibold mt-6 mb-2">To'lov tarixi</h2>
            <Table
                rowKey="id"
                dataSource={payments || []}
                columns={columns}
                pagination={false}
            />
        </div>
    );
};

export default StudentDetail;
