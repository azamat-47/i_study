import React, { useState } from "react";
import { Button, Popover, Input, message } from "antd";
import toast from "react-hot-toast";


const AddPaymentPopover = ({ record, branchId, currentMonth, currentYear, createPaymentMutation }) => {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(null);

  const handlePartialPayment = () => {
    

    createPaymentMutation.mutate({
      studentId: record.id,
      amount: Number(amount),
      branchId,
      groupId: record.groupId,
      description: `${currentMonth} - oy uchun qisman to'lov`,
      paymentYear: currentYear,
      paymentMonth: currentMonth,
    }, {
        onSuccess: () => {
            toast.success("Qisman to'lov muvaffaqiyatli qo'shildi");
            setAmount(null);
            setVisible(false);
        },
        onError: (error) => {
            toast.error("Xatolik yuz berdi: " + error.message);
        },
    });

    
  };

  const content = (
    <div style={{ width: 200 }}>
      <Input
        type="number"
        placeholder="Summani kiriting"
        value={amount}
        onChange={(val) => setAmount(val.target.value)}
        style={{ marginBottom: 8 }}
        // Formatlash (minglik ajratish)
        formatter={(val) =>
            val
              ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              : ""
          }
      />
      <Button type="primary" block onClick={handlePartialPayment}>
        Tasdiqlash
      </Button>
    </div>
  );

  return (
    <Popover
      content={content}
      title="Qisman to'lov"
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
    >
      <Button variant="filled" color="green">Qisman to‘lash</Button>
    </Popover>
  );
};

export default AddPaymentPopover;
