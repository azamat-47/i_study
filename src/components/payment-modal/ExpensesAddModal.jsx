import { Form, Modal, Button, Input, DatePicker, InputNumber } from 'antd'
import React, { useCallback } from 'react'
import usePayment from '../../hooks/usePayment';

const ExpensesAddModal = ({ isOpen, onClose }) => {
    const [expenseForm] = Form.useForm();

    const { postExpenseMutation } = usePayment();


    // Xarajat qo'shish
    const handleAddExpense = useCallback(async (values) => {
        try {
            const payload = {
                name: values.name,
                amount: parseFloat(values.amount),
                expenseDate: values.expenseDate.format('YYYY-MM-DD'),
                expenseMonth: values.expenseDate.format('YYYY-MM'),
                description: values.description || ''
            };

            await postExpenseMutation.mutateAsync(payload, {
                onSuccess: () => {
                    onClose();
                    expenseForm.resetFields();
                }
            });
        } catch (error) {
            console.error('Add expense error:', error);
        }
    }, [postExpenseMutation, expenseForm]);


    return (
        <Modal title={<span className="text-gray-200">Yangi Xarajat Qo'shish</span>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            className="dark-modal" >


            <Form
                form={expenseForm}
                layout="vertical"
                onFinish={handleAddExpense}
                className="space-y-4"
            >
                <Form.Item
                    name="name"
                    label={<span className="text-gray-200">Xarajat nomi</span>}
                    rules={[
                        { required: true, message: 'Xarajat nomini kiriting!' }
                    ]}
                >
                    <Input
                        placeholder="Xarajat nomini kiriting"
                        className="dark-input"
                    />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label={<span className="text-gray-200">Miqdor (so'm)</span>}
                    rules={[{ required: true, message: 'Xarajat miqdorini kiriting!' }]}

                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                        }
                        parser={(value) => value.replace(/\s/g, "")}
                    />
                    
                </Form.Item>

                <Form.Item
                    name="expenseDate"
                    label={<span className="text-gray-200">Xarajat sanasi</span>}
                    rules={[
                        { required: true, message: 'Xarajat sanasini tanlang!' }
                    ]}
                >
                    <DatePicker
                        className="dark-datepicker w-full"
                        placeholder="Sanani tanlang"
                        format="DD.MM.YYYY"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<span className="text-gray-200">Tavsif</span>}
                >
                    <Input.TextArea
                        placeholder="Xarajat haqida qo'shimcha ma'lumot"
                        className="dark-input"
                        rows={3}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button
                        onClick={() => {
                            setIsExpenseModalVisible(false);
                            expenseForm.resetFields();
                        }}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={postExpenseMutation.isLoading}
                        className="bg-red-600 hover:bg-red-500"
                    >
                        Xarajat Qo'shish
                    </Button>
                </div>
            </Form>


        </Modal>
    )
}

export default ExpensesAddModal
