import React, { useMemo } from "react";
import { Modal, Table, Button } from "antd";
import useStudents from "../../../hooks/useStudents";
import { useCourse } from "../../../hooks/useCourse";

const AddExistingStudentModal = ({ open, onClose, branchId, groupId, groupStudents }) => {
  const { studentsQuery } = useStudents(branchId);
  const { addStudentToGroupMutation } = useCourse(branchId);
  
  

  // Barcha studentlar
  const { data: allStudents = [], isLoading } = studentsQuery();

  
  const availableStudents = useMemo(() => {
    if (!allStudents || !groupStudents) return [];
    const groupIds = new Set(groupStudents.map((s) => s.studentId)); // ✅ studentId ishlatamiz
    return allStudents.filter((s) => !groupIds.has(s.id)); // allStudents massivida id bor
  }, [allStudents, groupStudents]);
  
  const handleAdd = (studentId) => {
    addStudentToGroupMutation.mutate({ studentId, groupId }, {
      onSuccess: () => {
        onClose();
      }
    });
  };


  const columns = [
    { title: "Ism", dataIndex: "firstName" },
    { title: "Familiya", dataIndex: "lastName" },
    { title: "Telefon", dataIndex: "phoneNumber" },
    {
      title: "Amal",
      render: (_, record) => (
        <Button
          type="primary"
          loading={addStudentToGroupMutation.isLoading}
          onClick={() => handleAdd(record.id)}
        >
          Qo‘shish
        </Button>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Mavjud talabani guruhga qo‘shish"
      footer={null}
      width={700}
    >
      <Table
        dataSource={availableStudents}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </Modal>
  );
};

export default AddExistingStudentModal;
