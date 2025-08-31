import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Card, Statistic, Tabs, Space, Popconfirm, message, Empty, Spin, Alert, Row, Col, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, DollarOutlined, CalendarOutlined, UserOutlined, BookOutlined, ReloadOutlined, ExclamationCircleOutlined, FileAddFilled } from '@ant-design/icons';
import usePayment from '../../hooks/usePayment';
import dayjs from 'dayjs';
import PaymentAddModal from '../../components/payment-modal/PaymentAddModal';
import toast from 'react-hot-toast';

const { Option } = Select;
const { TabPane } = Tabs;

const Payment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [openPopConfirmKey, setOpenPopConfirmKey] = useState(null);

  // usePayment hook'ini parametrlar bilan chaqirish
  const {
    fetchPayment,
    fetchPaymentByMonth,
    fetchAllUnpaid,
    postPaymentMutation,
    fetchFinancialSummary,
    deletePaymentMutation,
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
      toast.error("To'lov qo'shishda xatolik yuz berdi");
      setOpenPopConfirmKey(null);
    }
  }, [postPaymentMutation]);

  
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
      // Payment
      {
        key: '4',
        label: <span className="text-gray-200">To'lov Qo'shish</span>,
        children: (
          <Card className="border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Yangi To'lov Qo'shish</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Yangi To'lov
            </Button>
          </Card>
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
      </div>
    </div>
  );
};

export default Payment;