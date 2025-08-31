import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Card, Statistic, Tabs, Space, Popconfirm, message, Empty, Spin, Alert, Row, Col, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, DollarOutlined, CalendarOutlined, UserOutlined, BookOutlined, ReloadOutlined, ExclamationCircleOutlined, FileAddFilled, ShoppingOutlined, BankOutlined } from '@ant-design/icons';
import usePayment from '../../hooks/usePayment';
import dayjs from 'dayjs';
import PaymentAddModal from '../../components/payment-modal/PaymentAddModal';
import toast from 'react-hot-toast';

const { Option } = Select;
const { TabPane } = Tabs;

const Payment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [openPopConfirmKey, setOpenPopConfirmKey] = useState(null);
  const [expenseForm] = Form.useForm();

  // usePayment hook'ini parametrlar bilan chaqirish
  const {
    fetchPayment,
    fetchPaymentByMonth,
    fetchAllUnpaid,
    fetchExpenses,
    fetchExpensesByMonth,
    postPaymentMutation,
    fetchFinancialSummary,
    deletePaymentMutation,
    postExpenseMutation,
    deleteExpenseMutation,
    postTeacherSalaryExpenseMutation,
    refetchPaymentData,
    refetchExpenseData,
    isLoading,
    error
  } = usePayment(selectedMonth, selectedCourseId);

  // Kurslar ro'yxati (PaymentAddModal uchun)
  const courses = useMemo(() => {
    const courseSet = new Set();
    if (fetchPayment.data) {
      fetchPayment.data.forEach(payment => {
        if (payment.courseId && payment.courseName) {
          courseSet.add(JSON.stringify({ id: payment.courseId, name: payment.courseName }));
        }
      });
    }
    return Array.from(courseSet).map(item => JSON.parse(item));
  }, [fetchPayment.data]);

  // Xatoliklarni ko'rsatish (faqat bir marta ko'rsatish uchun)
  const [errorShown, setErrorShown] = useState(false);
  useEffect(() => {
    if (error && !errorShown) {
      toast.error(`Ma'lumot yuklashda xatolik: ${error.message}`);
      setErrorShown(true);
    }
    if (!error) {
      setErrorShown(false);
    }
  }, [error, errorShown]);

  // To'lovni o'chirish
  const handleDeletePayment = useCallback(async (id) => {
    try {
      await deletePaymentMutation.mutateAsync(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [deletePaymentMutation]);

  // Xarajatni o'chirish
  const handleDeleteExpense = useCallback(async (id) => {
    try {
      await deleteExpenseMutation.mutateAsync(id);
    } catch (error) {
      console.error('Delete expense error:', error);
    }
  }, [deleteExpenseMutation]);

  // Ma'lumotlarni qayta yuklash
  const handleRefresh = useCallback(() => {
    refetchPaymentData();
    refetchExpenseData();
    toast.success("Ma'lumotlar yangilandi!");
  }, [refetchPaymentData, refetchExpenseData]);

  // To'lov qo'shish - Jadvaldan
  const postStudentFromTable = useCallback(async (record) => {
    try {
      const payload = {
        studentId: record.studentId,
        courseId: record.courseId,
        studentName: record.studentName,
        courseName: record.courseName,
        amount: record.courseFee,
        paymentMonth: record.month,
        paymentDate: dayjs().format('YYYY-MM-DD')
      };

      await postPaymentMutation.mutateAsync(payload);
      setOpenPopConfirmKey(null);
      toast.success("To'lov muvaffaqiyatli qo'shildi!");
      
    } catch (error) {
      console.error('Post error:', error);
      setOpenPopConfirmKey(null);
    }
  }, [postPaymentMutation]);

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

      await postExpenseMutation.mutateAsync(payload);
      setIsExpenseModalVisible(false);
      expenseForm.resetFields();
      toast.success("Xarajat muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error('Add expense error:', error);
      toast.error("Xarajat qo'shishda xatolik yuz berdi");
    }
  }, [postExpenseMutation, expenseForm]);

  // O'qituvchi maoshini to'lash
  const handlePayTeacherSalary = useCallback(async (teacherId, teacherName) => {
    try {
      const payload = {
        teacherId: teacherId,
        month: selectedMonth
      };

      await postTeacherSalaryExpenseMutation.mutateAsync(payload);
      toast.success(`${teacherName} ning maoshi muvaffaqiyatli to'landi!`);
    } catch (error) {
      console.error('Pay teacher salary error:', error);
      toast.error("O'qituvchi maoshini to'lashda xatolik yuz berdi");
    }
  }, [postTeacherSalaryExpenseMutation, selectedMonth]);

  const paymentColumns = useMemo(() => [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a, b) => a.studentName?.localeCompare(b.studentName),
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-400" />
          <span className="text-gray-200">{text || 'Noma\'lum'}</span>
        </div>
      ),
    },
    {
      title: 'Kurs',
      dataIndex: 'courseName',
      key: 'courseName',
      sorter: (a, b) => a.courseName?.localeCompare(b.courseName),
      render: (text) => (
        <div className="flex items-center gap-2">
          <BookOutlined className="text-green-400" />
          <span className="text-gray-200">{text || 'Noma\'lum kurs'}</span>
        </div>
      ),
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      render: (amount) => (
        <span className="text-green-400 font-semibold">
          {typeof amount === 'number' ? amount.toLocaleString() : '0'} so'm
        </span>
      ),
    },
    {
      title: 'To\'lov oyi',
      dataIndex: 'paymentMonth',
      key: 'paymentMonth',
      sorter: (a, b) => new Date(a.paymentMonth) - new Date(b.paymentMonth),
      render: (month) => (
        <span className="text-gray-300">
          {month ? dayjs(month).format('MMMM YYYY') : 'Noma\'lum'}
        </span>
      ),
    },
    {
      title: 'Sana',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-yellow-400" />
          <span className="text-gray-200">
            {date ? dayjs(date).format('DD.MM.YYYY') : 'Noma\'lum'}
          </span>
        </div>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="To'lovni o'chirish"
          description="Haqiqatan ham bu to'lovni o'chirmoqchimisiz?"
          onConfirm={() => handleDeletePayment(record.id)}
          okText="Ha"
          cancelText="Yo'q"
          placement="topRight"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={deletePaymentMutation.isLoading}
          >
            O'chirish
          </Button>
        </Popconfirm>
      )
    }
  ], [handleDeletePayment, deletePaymentMutation.isLoading]);

  // Xarajatlar jadvali ustunlari
  const expenseColumns = useMemo(() => [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name?.localeCompare(b.name),
      render: (text, record) => (
        <div className="flex items-center gap-2">
          {record.type === 'teacher_salary' ? (
            <BankOutlined className="text-purple-400" />
          ) : (
            <ShoppingOutlined className="text-orange-400" />
          )}
          <span className="text-gray-200">{text || 'Noma\'lum'}</span>
          {record.type === 'teacher_salary' && (
            <Tag color="purple" size="small">Maosh</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      render: (amount) => (
        <span className="text-red-400 font-semibold">
          -{typeof amount === 'number' ? amount.toLocaleString() : '0'} so'm
        </span>
      ),
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <span className="text-gray-300">{text || 'Tavsif yo\'q'}</span>
      ),
    },
    {
      title: 'Xarajat oyi',
      dataIndex: 'expenseMonth',
      key: 'expenseMonth',
      sorter: (a, b) => new Date(a.expenseMonth) - new Date(b.expenseMonth),
      render: (month) => (
        <span className="text-gray-300">
          {month ? dayjs(month).format('MMMM YYYY') : 'Noma\'lum'}
        </span>
      ),
    },
    {
      title: 'Sana',
      dataIndex: 'expenseDate',
      key: 'expenseDate',
      sorter: (a, b) => new Date(a.expenseDate) - new Date(b.expenseDate),
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-yellow-400" />
          <span className="text-gray-200">
            {date ? dayjs(date).format('DD.MM.YYYY') : 'Noma\'lum'}
          </span>
        </div>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Xarajatni o'chirish"
          description="Haqiqatan ham bu xarajatni o'chirmoqchimisiz?"
          onConfirm={() => handleDeleteExpense(record.id)}
          okText="Ha"
          cancelText="Yo'q"
          placement="topRight"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={deleteExpenseMutation.isLoading}
          >
            O'chirish
          </Button>
        </Popconfirm>
      )
    }
  ], [handleDeleteExpense, deleteExpenseMutation.isLoading]);

  // Jadval ustunlari - To'lanmaganlar
  const unpaidColumns = useMemo(() => [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-400" />
          <span className="text-gray-200">{text || 'Noma\'lum'}</span>
        </div>
      ),
    },
    {
      title: 'Kurs',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text) => (
        <div className="flex items-center gap-2">
          <BookOutlined className="text-green-400" />
          <span className="text-gray-200">{text || 'Noma\'lum kurs'}</span>
        </div>
      ),
    },
    {
      title: 'Qarzi',
      dataIndex: 'courseFee',
      key: 'courseFee',
      render: (amount) => (
        <span className="text-red-400 font-semibold">
          {typeof amount === 'number' ? amount.toLocaleString() : '0'} so'm
        </span>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record, index) => {
        const uniqueKey = record.id || `${record.studentId}-${record.month}-${index}`;

        return (
          <Popconfirm
            placement="top"
            title={
              <Card size="small" style={{ borderRadius: 12 }}>
                <h3>Ma'lumotlarni qo'shishni xohlaysizmi?</h3>
                <p><b>O'quvchi:</b> {record.studentName || 'Noma\'lum'}</p>
                <p><b>Kurs nomi:</b> {record.courseName || 'Noma\'lum kurs'}</p>
                <p><b>Oy:</b> <i className="font-bold">{record.month || 'Noma\'lum'}</i> uchun</p>
                <p><b>To'lov:</b> {typeof record.courseFee === 'number' ? record.courseFee.toLocaleString() : '0'} so'm</p>
              </Card>
            }
            okText="Ha, qo'sh"
            cancelText="Bekor qilish"
            open={openPopConfirmKey === uniqueKey}
            onConfirm={() => postStudentFromTable(record)}
            onCancel={() => setOpenPopConfirmKey(null)}
            onOpenChange={(visible) => setOpenPopConfirmKey(visible ? uniqueKey : null)}
            icon={<FileAddFilled style={{ color: "green" }} />}
            okButtonProps={{
              loading: postPaymentMutation.isLoading && openPopConfirmKey === uniqueKey
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={postPaymentMutation.isLoading && openPopConfirmKey === uniqueKey}
            >
              To'lov Qo'shish
            </Button>
          </Popconfirm>
        );
      }
    }
  ], [postStudentFromTable, postPaymentMutation.isLoading, openPopConfirmKey]);

  // Moliyaviy statistikalar
  const renderFinancialSummary = () => {
    if (!fetchFinancialSummary.data) return null;

    const { totalIncome, totalExpenses, netProfit } = fetchFinancialSummary.data;

    return (
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={8}>
          <Card className="border-gray-700 bg-gradient-to-r from-green-900 to-green-800">
            <Statistic
              title={<span className="text-gray-300">Jami <Tag>Oylik</Tag>Daromad</span>}
              value={totalIncome || 0}
              suffix="so'm"
              valueStyle={{ color: '#10b981' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="border-gray-700 bg-gradient-to-r from-red-900 to-red-800">
            <Statistic
              title={<span className="text-gray-300">Jami <Tag>Oylik</Tag>Xarajat</span>}
              value={totalExpenses || 0}
              suffix="so'm"
              valueStyle={{ color: '#ef4444' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="border-gray-700 bg-gradient-to-r from-blue-900 to-blue-800">
            <Statistic
              title={<span className="text-gray-300">Sof <Tag>Oylik</Tag>Foyda</span>}
              value={netProfit || 0}
              suffix="so'm"
              valueStyle={{ color: netProfit >= 0 ? '#10b981' : '#ef4444' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // Tab content
  const renderTabContent = () => {
    const tabItems = [
      {
        key: '1',
        label: <span className="text-gray-200">Barcha To'lovlar</span>,
        children: (
          <Card className="border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-200">
                Barcha To'lovlar ({fetchPayment.data?.length || 0})
              </h3>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                className="text-gray-300"
                loading={fetchPayment.isLoading}
              >
                Yangilash
              </Button>
            </div>
            <Table
              columns={paymentColumns}
              dataSource={fetchPayment.data || []}
              loading={fetchPayment.isLoading}
              rowKey={(record) => record.id || `payment-${Math.random()}`}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} ta to'lov bajarildi`,
              }}
              className="custom-dark-table"
              locale={{
                emptyText: (
                  <Empty
                    description={<span className="text-gray-400">Hech qanday to'lov topilmadi</span>}
                  />
                )
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        ),
      },
      {
        key: '2',
        label: <span className="text-gray-200">Oylik To'lovlar</span>,
        children: (
          <Card className="border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-200">
                {dayjs(selectedMonth).format('MMMM YYYY')} oyi uchun to'lovlar
                ({fetchPaymentByMonth.data?.payments?.length || 0})
              </h3>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                className="text-gray-300"
                loading={fetchPaymentByMonth.isLoading}
              >
                Yangilash
              </Button>
            </div>
            <Table
              columns={paymentColumns}
              dataSource={fetchPaymentByMonth.data?.payments || []}
              loading={fetchPaymentByMonth.isLoading}
              rowKey={(record) => record.id || `monthly-${Math.random()}`}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} ta o'quvchi to'lov qilgan`,
              }}
              className="custom-dark-table"
              locale={{
                emptyText: (
                  <Empty
                    description={<span className="text-gray-400">Bu oy uchun to'lov topilmadi</span>}
                  />
                )
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        ),
      },
      {
        key: '3',
        label: <span className="text-gray-200">To'lanmagan</span>,
        children: (
          <div className="space-y-6">
            {/* All Unpaid */}
            <Card
              className="border-gray-700"
              title={
                <span className="text-gray-200">
                  <i><b>{dayjs(selectedMonth).format('MMMM YYYY')}</b></i> To'lanmaganlar ({fetchAllUnpaid.data?.length || 0})
                </span>
              }
            >
              <Table
                columns={unpaidColumns}
                dataSource={fetchAllUnpaid.data || []}
                loading={fetchAllUnpaid.isLoading}
                rowKey={(record, index) => record.id || `unpaid-all-${index}`}
                pagination={{
                  pageSize: 10,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} ta to'lov qilinmagan`,
                }}
                className="custom-dark-table"
                locale={{
                  emptyText: (
                    <Empty
                      description={<span className="text-gray-400">To'lanmagan to'lovlar yo'q</span>}
                    />
                  )
                }}
                scroll={{ x: 600 }}
              />
            </Card>
          </div>
        ),
      },
      // Expenses Tab
      {
        key: '4',
        label: <span className="text-gray-200">Xarajatlar</span>,
        children: (
          <div className="space-y-6">
            {/* Barcha Xarajatlar */}
            <Card className="border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-200">
                  Barcha Xarajatlar ({fetchExpenses.data?.length || 0})
                </h3>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsExpenseModalVisible(true)}
                    className="bg-red-600 hover:bg-red-500"
                  >
                    Yangi Xarajat
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    className="text-gray-300"
                    loading={fetchExpenses.isLoading}
                  >
                    Yangilash
                  </Button>
                </Space>
              </div>
              <Table
                columns={expenseColumns}
                dataSource={fetchExpenses.data || []}
                loading={fetchExpenses.isLoading}
                rowKey={(record) => record.id || `expense-${Math.random()}`}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} ta xarajat`,
                }}
                className="custom-dark-table"
                locale={{
                  emptyText: (
                    <Empty
                      description={<span className="text-gray-400">Hech qanday xarajat topilmadi</span>}
                    />
                  )
                }}
                scroll={{ x: 800 }}
              />
            </Card>

            {/* Oylik Xarajatlar */}
            <Card className="border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-200">
                  {dayjs(selectedMonth).format('MMMM YYYY')} oyi uchun xarajatlar
                  ({fetchExpensesByMonth.data?.length || 0})
                </h3>
              </div>
              <Table
                columns={expenseColumns}
                dataSource={fetchExpensesByMonth.data || []}
                loading={fetchExpensesByMonth.isLoading}
                rowKey={(record) => record.id || `monthly-expense-${Math.random()}`}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} ta oylik xarajat`,
                }}
                className="custom-dark-table"
                locale={{
                  emptyText: (
                    <Empty
                      description={<span className="text-gray-400">Bu oy uchun xarajat topilmadi</span>}
                    />
                  )
                }}
                scroll={{ x: 800 }}
              />
            </Card>
          </div>
        ),
      }
    ];

    return (
      <Tabs
        items={tabItems}
        className="custom-dark-tabs"
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-white">To'lovlar Boshqaruvi</h1>
          <div className="flex gap-4 items-center flex-wrap">
            <DatePicker
              picker="month"
              value={dayjs(selectedMonth)}
              onChange={(date) => setSelectedMonth(date ? date.format('YYYY-MM') : dayjs().format('YYYY-MM'))}
              className="dark-datepicker"
              placeholder="Oyni tanlang"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Yangi To'lov
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Xatolik"
            description={error.message}
            type="error"
            showIcon
            className="mb-6"
            closable
          />
        )}

        {/* Global Loading */}
        <Spin spinning={isLoading} tip="Ma'lumotlar yuklanmoqda...">
          {/* Financial Summary Cards */}
          {renderFinancialSummary()}

          {/* Tabs */}
          {renderTabContent()}
        </Spin>

        {/* Payment Add Modal */}
        <PaymentAddModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          courses={courses}
        />

        {/* Expense Add Modal */}
        <Modal
          title={<span className="text-gray-200">Yangi Xarajat Qo'shish</span>}
          open={isExpenseModalVisible}
          onCancel={() => {
            setIsExpenseModalVisible(false);
            expenseForm.resetFields();
          }}
          footer={null}
          className="dark-modal"
        >
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
              rules={[
                { required: true, message: 'Xarajat miqdorini kiriting!' },
                { 
                  type: 'number',
                  min: 0,
                  message: 'Miqdor 0 dan katta bo\'lishi kerak!',
                  transform: (value) => value ? Number(value) : value
                }
              ]}
            >
              <Input
                type="number"
                placeholder="Xarajat miqdorini kiriting"
                className="dark-input"
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
      </div>
    </div>
  );
};

export default Payment;