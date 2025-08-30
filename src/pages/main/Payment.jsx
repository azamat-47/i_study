import React, { useState, useEffect } from 'react';
import { Table,  Button,   Modal,   Form,   Input,   Select,   DatePicker,   Card,   Statistic,   Tabs,   Space,   Popconfirm,   message,   Empty,  Spin, Alert,  Row,  Col} from 'antd';
import {  PlusOutlined,  DeleteOutlined,  DollarOutlined,  CalendarOutlined,  UserOutlined,  BookOutlined,  ReloadOutlined,  ExclamationCircleOutlined} from '@ant-design/icons';
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

  // usePayment hook'ini parametrlar bilan chaqirish
  const {
    fetchPayment,
    fetchPaymentByMonth,
    fetchAllUnpaid,
    fetchCourseStudentsUnpaid,
    fetchFinancialSummary,
    deletePaymentMutation,
    postPaymentMutation,
    refetchPaymentData,
    refetchExpenseData,
    isLoading,
    error
  } = usePayment(selectedMonth, selectedCourseId);

  // Xatoliklarni ko'rsatish
  useEffect(() => {
    if (error) {
      toast.error(`Ma'lumot yuklashda xatolik: ${error.message}`);
    }
  }, [error]);

  // To'lovni o'chirish
  const handleDeletePayment = async (id) => {
    try {
      await deletePaymentMutation.mutateAsync(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Ma'lumotlarni qayta yuklash
  const handleRefresh = () => {
    refetchPaymentData();
    refetchExpenseData();
    message.success("Ma'lumotlar yangilandi!");
  };

  

  // Mock courses - bu yerga haqiqiy kurslar datasi kelishi kerak
  const courses = [
    { id: 1, name: 'Frontend Development' },
    { id: 2, name: 'Backend Development' },
    { id: 3, name: 'Full Stack Development' },
    { id: 4, name: 'Mobile Development' },
    { id: 5, name: 'Data Science' }
  ];

  // Jadval ustunlari - To'lovlar
  const paymentColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a, b) => a.studentName?.localeCompare(b.studentName),
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-400" />
          <span className="text-gray-200">{text}</span>
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
          <span className="text-gray-200">{text}</span>
        </div>
      ),
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <span className="text-green-400 font-semibold">
          {amount?.toLocaleString()} so'm
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
          {dayjs(month).format('MMMM YYYY')}
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
            {dayjs(date).format('DD.MM.YYYY')}
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
  ];

  // Jadval ustunlari - To'lanmaganlar
  const unpaidColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-400" />
          <span className="text-gray-200">{text}</span>
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
          <span className="text-gray-200">{text}</span>
        </div>
      ),
    },
    {
      title: 'Qarzi',
      dataIndex: 'courseFee',
      key: 'courseFee',
      render: (amount) => (
        <span className="text-red-400 font-semibold">
          {amount?.toLocaleString()} so'm
        </span>
      ),
    }
  ];

  // Moliyaviy statistikalar
  const renderFinancialSummary = () => {
    if (!fetchFinancialSummary.data) return null;

    const { totalIncome, totalExpenses, netProfit } = fetchFinancialSummary.data;
    const unpaidAmount = fetchAllUnpaid.data?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

    console.log(fetchFinancialSummary.data);
    

    return (
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card className="border-gray-700 bg-gradient-to-r from-green-900 to-green-800">
            <Statistic
              title={<span className="text-gray-300">Jami Daromad</span>}
              value={totalIncome || 0}
              suffix="so'm"
              valueStyle={{ color: '#10b981' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-gray-700 bg-gradient-to-r from-red-900 to-red-800">
            <Statistic
              title={<span className="text-gray-300">Jami Xarajat</span>}
              value={totalExpenses || 0}
              suffix="so'm"
              valueStyle={{ color: '#ef4444' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-gray-700 bg-gradient-to-r from-blue-900 to-blue-800">
            <Statistic
              title={<span className="text-gray-300">Sof Foyda</span>}
              value={netProfit || 0}
              suffix="so'm"
              valueStyle={{ color: netProfit >= 0 ? '#10b981' : '#ef4444' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-gray-700 bg-gradient-to-r from-yellow-900 to-yellow-800">
            <Statistic
              title={<span className="text-gray-300">To'lanmagan</span>}
              value={unpaidAmount}
              suffix="so'm"
              valueStyle={{ color: '#f59e0b' }}
              prefix={<CalendarOutlined />}
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
              >
                Yangilash
              </Button>
            </div>
            <Table
              columns={paymentColumns}
              dataSource={fetchPayment.data || []}
              loading={fetchPayment.isLoading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} ta tolov bajarildi`,
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
                ({fetchPaymentByMonth.data?.payments.length || 0})
              </h3>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                className="text-gray-300"
              >
                Yangilash
              </Button>
            </div>
            <Table
              columns={paymentColumns}
              dataSource={fetchPaymentByMonth.data?.payments || []}
              loading={fetchPaymentByMonth.isLoading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} ta uquvchi to'lov qilgan`,
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
            {/* Course Selection */}
            <Card className="border-gray-700">
              <div className="flex gap-4 items-center flex-wrap">
                <span className="text-gray-200">Kurs tanlang:</span>
                <Select
                  placeholder="Kursni tanlang"
                  style={{ width: 300 }}
                  onChange={setSelectedCourseId}
                  value={selectedCourseId}
                  className="dark-select"
                  allowClear
                >
                  {courses.map(course => (
                    <Option key={course.id} value={course.id}>
                      {course.name}
                    </Option>
                  ))}
                </Select>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleRefresh}
                  className="text-gray-300"
                >
                  Yangilash
                </Button>
              </div>
            </Card>

            {/* All Unpaid */}
            <Card 
              className="border-gray-700" 
              title={
                <span className="text-gray-200">
                  Barcha To'lanmaganlar ({fetchAllUnpaid.data?.length || 0})
                </span>
              }
            >
              <Table
                columns={unpaidColumns}
                dataSource={fetchAllUnpaid.data || []}
                loading={fetchAllUnpaid.isLoading}
                rowKey={(record, index) => record.id || index}
                pagination={{ 
                  pageSize: 5,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} ta tolov qilinmagan`,
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

            {/* Course Unpaid Students */}
            {selectedCourseId && (
              <Card 
                className="border-gray-700" 
                title={
                  <span className="text-gray-200">
                    {courses.find(c => c.id === selectedCourseId)?.name} 
                    kursi bo'yicha to'lanmaganlar ({fetchCourseStudentsUnpaid.data?.length || 0})
                  </span>
                }
              >
                <Table
                  columns={unpaidColumns}
                  dataSource={fetchCourseStudentsUnpaid.data || []}
                  loading={fetchCourseStudentsUnpaid.isLoading}
                  rowKey={(record, index) => record.id || index}
                  pagination={{ 
                    pageSize: 5,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} of ${total} ta uquvchi ${dayjs(selectedMonth).format('MMMM YYYY')} uchun to'lov qilmagan`,
                  }}
                  className="custom-dark-table"
                  locale={{
                    emptyText: (
                      <Empty
                        description={
                          <span className="text-gray-400">
                            Bu kurs uchun to'lanmagan talabalar yo'q
                          </span>
                        }
                      />
                    )
                  }}
                  scroll={{ x: 600 }}
                />
              </Card>
            )}
          </div>
        ),
      },
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
    <div className="min-h-screen p-6 ">
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
              loading={postPaymentMutation.isLoading}
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