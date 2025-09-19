import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, DatePicker, Space, Statistic, Row, Col, Table, Typography, Popconfirm } from 'antd';
import { PlusOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import useReports from '../../hooks/useReports';
import usePayment from '../../hooks/usePayment';
import useExpenses from '../../hooks/useExpenses';
import AddExpenseModal from '../../components/modals/payment/AddExpenseModal';
import TagUi from '../../components/ui/Tag';
import toast from 'react-hot-toast';
import AddPaymentPopover from '../../components/modals/payment/AddPaymentPopover';

const { TabPane } = Tabs;
const { Title } = Typography;

const Payment = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [branchId, setBranchId] = useState(null);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);

  // Sana filtrlash uchun state'lar
  const [filterType, setFilterType] = useState('month');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedRange, setSelectedRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);

  useEffect(() => {
    const storedBranchId = localStorage.getItem("branchId");
    if (storedBranchId) {
      setBranchId(Number(storedBranchId));
    }
  }, []);

  // Reports hook
  const {
    financialSummaryQuery,
    financialSummaryRangeQuery,
    refreshFinancialSummary,
    refreshFinancialSummaryRange
  } = useReports(branchId);

  const currentYear = selectedDate.year();
  const currentMonth = selectedDate.month() + 1;
  const rangeStartDate = selectedRange[0]?.format('YYYY-MM-DD');
  const rangeEndDate = selectedRange[1]?.format('YYYY-MM-DD');

  // Payment hook
  const {
    paymentsQuery,
    paymentsByMonthQuery,
    createPaymentMutation,
    deletePaymentMutation,
    getUnpaidStudentsQuery,
  } = usePayment({ branchId, year: currentYear, month: currentMonth });

  const unpaidStudents = getUnpaidStudentsQuery;

  // Expenses hook
  const { expensesQuery, deleteExpenseMutation } = useExpenses(branchId);

  const financialSummaryMonth = financialSummaryQuery({ year: currentYear, month: currentMonth });
  const financialSummaryRange = financialSummaryRangeQuery({ startDate: rangeStartDate, endDate: rangeEndDate });

  const paymentMonth = paymentsByMonthQuery({ branchId, year: currentYear, month: currentMonth }).data;

  const allPayments = paymentsQuery.data;
  const allExpenses = expensesQuery.data;

  const currentFinancialSummary = filterType === 'range' ? financialSummaryRange : financialSummaryMonth;

  const handleAddPayment = (data) => {
    createPaymentMutation.mutate(data);
  };

  // To'lovlar jadvali
  const paymentColumns = [
    { title: 'Talaba', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Kurs', dataIndex: 'courseName', key: 'courseName' },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <TagUi>{amount.toLocaleString()} so'm</TagUi>,
    },
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Izoh',
      dataIndex: 'description',
      render: (coment) => coment ? coment.substring(0, 30) : "",
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Rostdan ham o'chirib tashlaysizmi?"
          onConfirm={() => deletePaymentMutation.mutate(record.id)}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Button
            danger
            type="primary"
            icon={<DeleteFilled />}
            size="small"
            loading={deletePaymentMutation.isLoading}
          />
        </Popconfirm>
      ),
    },
  ];

  // Xarajatlar jadvali
  const expenseColumns = [
    { title: 'Kategoriya', dataIndex: 'category', key: 'category' },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <TagUi color="red">{amount.toLocaleString()} so'm</TagUi>,
    },
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    { title: 'Izoh', dataIndex: 'description', key: 'description' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Rostdan ham o'chirib tashlaysizmi?"
          onConfirm={() => {
            deleteExpenseMutation.mutate(record.id); // Xarajat o'chirish funksiyasi
          }}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Button
            danger
            type="primary"
            icon={<DeleteFilled />}
            size="small"
          // loading={deleteExpenseMutation.isLoading} // Xarajat o'chirish loading
          />
        </Popconfirm>
      ),
    },
  ];

  // To'lanmagan talabalar jadvali
  const unpaidStudentsColumns = [
    {
      title: 'Talaba',
      key: 'fullName',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: 'Guruh', dataIndex: 'groupName', key: 'groupName' },
    {
      title: 'Miqdor',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      render: (amount) =>
        amount ? <TagUi>{amount.toLocaleString()} so'm</TagUi> : "Noma'lum",
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={
              <div>
                <div>{record.firstName} {record.lastName}</div>
                <div>{currentMonth}-oy <strong>{record.groupName}</strong> guruhi</div>
              </div>
            }
            onConfirm={() => {
              handleAddPayment({
                studentId: record.id,
                amount: record.remainingAmount,
                branchId,
                groupId: record.groupId,
                description: `${currentMonth} - oy uchun to'lov`,
                paymentYear: currentYear,
                paymentMonth: currentMonth,
              });
            }}
            okText="To'lov amalga oshirish"
            cancelText="Yo'q"
          >
            <Button variant='filled' color='primary'>To'lov Qo'shish</Button>
          </Popconfirm>
          <AddPaymentPopover
            record={record}
            branchId={branchId}
            currentMonth={currentMonth}
            currentYear={currentYear}
            createPaymentMutation={createPaymentMutation}
          />
        </Space>
      ),
    }
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilterType('day');
  };

  return (
    <div>
      <Title level={2}>Moliyaviy Boshqaruv</Title>

      <Card>
        <Row gutter={16}>
          <Col span={4} className='justify-center! flex flex-col'>
            <h6>Oyni Kiriting</h6>
            <DatePicker
              picker="month"
              value={selectedDate}
              onChange={handleDateChange}
              allowClear={false}
            />
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Jami To'lovlar"
                value={currentFinancialSummary.data?.totalIncome || 0}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
                suffix="UZS"
                loading={currentFinancialSummary.isLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Jami Xarajatlar"
                value={currentFinancialSummary.data?.totalExpenses || 0}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
                suffix="UZS"
                loading={currentFinancialSummary.isLoading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Sof Foyda"
                value={currentFinancialSummary.data?.netProfit || 0}
                precision={0}
                valueStyle={{ color: currentFinancialSummary.data?.netProfit >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={<DollarOutlined />}
                suffix="UZS"
                loading={currentFinancialSummary.isLoading}
              />
            </Card>
          </Col>
          <Button onClick={() => {
            if (filterType === 'range') {
              refreshFinancialSummaryRange();
              toast.success("Muvaffaqiyatli yangilandi!");
            } else {
              refreshFinancialSummary();
              toast.success("Muvaffaqiyatli yangilandi!");
            }
          }}
            variant="solid" color='cyan'>
            Yangilash
          </Button>

        </Row>
      </Card>

      <Tabs activeKey={activeTab} className='mt-2' onChange={setActiveTab} type="card">
        <TabPane tab="Umumiy To'lovlar" key="1">
          <h3 className='text-xl font-extrabold'>Barcha To'lovlar</h3>
          <Table
            columns={paymentColumns}
            dataSource={allPayments || []}
            loading={paymentsQuery.isLoading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>

        <TabPane tab="Oylik To'lovlar" key="2">
          <h3 className='text-xl font-extrabold'>
            <span className='text-amber-600'>{currentYear} - {currentMonth}</span> uchun To'lovlar
          </h3>
          <Table
            columns={paymentColumns}
            dataSource={paymentMonth || []}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>

        <TabPane tab="To'lanmagan Talabalar" key="3">

          <h3 className='text-xl font-extrabold'>
            <span className='text-amber-600'>{currentYear} - {currentMonth}</span> uchun To'lanmagan Talabalar
          </h3>
          <Table
            columns={unpaidStudentsColumns}
            dataSource={unpaidStudents.data}
            loading={unpaidStudents.isLoading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>

        <TabPane tab="Xarajatlar" key="4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddExpenseModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Xarajat qo'shish
          </Button>
          <Table
            columns={expenseColumns}
            dataSource={allExpenses || []}
            loading={expensesQuery.isLoading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
      </Tabs>

      <AddExpenseModal
        isVisible={isAddExpenseModalVisible}
        onClose={() => setIsAddExpenseModalVisible(false)}
        branchId={branchId}
      />
    </div>
  );
};

export default Payment;
