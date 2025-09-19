import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Button,
  DatePicker,
  Space,
  Statistic,
  Row,
  Col,
  Table,
  Typography,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query'; // QueryClient import qilish
import useFinance from '../../hooks/useFinance'; // Yangi birlashtrilgan hook
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
  const [selectedRange, setSelectedRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);

  const queryClient = useQueryClient(); // QueryClient hook

  useEffect(() => {
    const storedBranchId = localStorage.getItem('branchId');
    if (storedBranchId) {
      setBranchId(Number(storedBranchId));
    }
  }, []);

  const currentYear = selectedDate?.year() ?? dayjs().year();
  const currentMonth = (selectedDate?.month() ?? dayjs().month()) + 1;
  const rangeStartDate = selectedRange?.[0]?.format?.('YYYY-MM-DD') ?? null;
  const rangeEndDate = selectedRange?.[1]?.format?.('YYYY-MM-DD') ?? null;

  // Yangi birlashtrilgan hook
  const {
    // Expense operations
    expensesQuery,
    deleteExpenseMutation,
    
    // Payment operations
    paymentsQuery,
    paymentsByMonthQuery,
    createPaymentMutation,
    deletePaymentMutation,
    unpaidStudentsQuery,
    
    // Reports
    financialSummaryQuery,
    financialSummaryRangeQuery,
    refreshFinancialSummary,
    refreshFinancialSummaryRange,
    refreshAllData,
  } = useFinance({ branchId, year: currentYear, month: currentMonth });

  // Ma'lumotlarni olish
  const financialSummaryMonth = financialSummaryQuery({ year: currentYear, month: currentMonth });
  const financialSummaryRange = financialSummaryRangeQuery({ 
    startDate: rangeStartDate, 
    endDate: rangeEndDate 
  });

  const paymentsByMonth = paymentsByMonthQuery({ branchId, year: currentYear, month: currentMonth });
  const allPayments = paymentsQuery?.data ?? [];
  const allExpenses = expensesQuery?.data ?? [];
  const unpaidStudents = unpaidStudentsQuery?.data ?? [];

  const currentFinancialSummary = filterType === 'range' ? financialSummaryRange : financialSummaryMonth;

  const handleAddPayment = (data) => {
    if (!data) return;
    createPaymentMutation.mutate(data);
  };

  // To'lovlar jadvali
  const paymentColumns = [
    { title: "Talaba", dataIndex: "studentName", key: "studentName" },
    { title: "Kurs", dataIndex: "courseName", key: "courseName" },
    {
      title: "Miqdor",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        amount || amount === 0 ? (
          <TagUi>{Number(amount).toLocaleString()} so'm</TagUi>
        ) : (
          <TagUi>Noma'lum</TagUi>
        ),
    },
    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: "Izoh",
      dataIndex: "description",
      key: "description",
      render: (comment) => (comment ? String(comment).substring(0, 30) : ''),
    },
    {
      title: "Amallar",
      key: "actions",
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
            loading={deletePaymentMutation?.isLoading}
          />
        </Popconfirm>
      ),
    },
  ];

  // Xarajatlar jadvali
  const expenseColumns = [
    { title: "Kategoriya", dataIndex: "category", key: "category" },
    {
      title: "Miqdor",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        amount || amount === 0 ? (
          <TagUi color="red">{Number(amount).toLocaleString()} so'm</TagUi>
        ) : (
          <TagUi color="red">Noma'lum</TagUi>
        ),
    },
    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''),
    },
    { title: "Izoh", dataIndex: "description", key: "description" },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Rostdan ham o'chirib tashlaysizmi?"
          onConfirm={() => {
            deleteExpenseMutation.mutate(record.id);
          }}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Button
            danger
            type="primary"
            icon={<DeleteFilled />}
            size="small"
            loading={deleteExpenseMutation?.isLoading}
          />
        </Popconfirm>
      ),
    },
  ];

  // To'lanmagan talabalar jadvali
  const unpaidStudentsColumns = [
    {
      title: "Talaba",
      key: "fullName",
      render: (_, record) => `${record?.firstName ?? ''} ${record?.lastName ?? ''}`,
    },
    { title: "Guruh", dataIndex: "groupName", key: "groupName" },
    {
      title: "Miqdor",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (amount) =>
        amount || amount === 0 ? <TagUi>{Number(amount).toLocaleString()} so'm</TagUi> : "Noma'lum",
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={
              <div>
                <div>
                  {record?.firstName ?? ''} {record?.lastName ?? ''}
                </div>
                <div>
                  {currentMonth}-oy <strong>{record?.groupName ?? ''}</strong> guruhi
                </div>
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
            <Button type="primary">To'lov Qo'shish</Button>
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
    },
  ];

  const handleDateChange = (date) => {
    if (!date) return;
    
    const newYear = date.year();
    const newMonth = date.month() + 1;
    
    // Eski unpaid-students cache'ini tozalash
    if (currentYear !== newYear || currentMonth !== newMonth) {
      // Cache'ni tozalash
      queryClient?.removeQueries({ 
        queryKey: ['unpaid-students'], 
        exact: false 
      });
    }
    
    setSelectedDate(date);
    setFilterType('month');
  };

  const handleRefresh = () => {
    if (filterType === 'range') {
      refreshFinancialSummaryRange();
    } else {
      refreshFinancialSummary();
    }
    // Barcha ma'lumotlarni yangilash
    refreshAllData();
    toast.success('Muvaffaqiyatli yangilandi!');
  };

  return (
    <div>
      <Title level={2}>Moliyaviy Boshqaruv</Title>

      <Card>
        <Row gutter={16} align="middle">
          <Col span={4} className="flex flex-col justify-center">
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
                value={currentFinancialSummary?.data?.totalIncome ?? 0}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
                suffix="UZS"
                loading={currentFinancialSummary?.isLoading}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Jami Xarajatlar"
                value={currentFinancialSummary?.data?.totalExpenses ?? 0}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
                suffix="UZS"
                loading={currentFinancialSummary?.isLoading}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Sof Foyda"
                value={currentFinancialSummary?.data?.netProfit ?? 0}
                precision={0}
                valueStyle={{
                  color:
                    (currentFinancialSummary?.data?.netProfit ?? 0) >= 0 ? '#3f8600' : '#cf1322',
                }}
                prefix={<DollarOutlined />}
                suffix="UZS"
                loading={currentFinancialSummary?.isLoading}
              />
            </Card>
          </Col>

          <Col>
            <Button
              onClick={handleRefresh}
              variant="solid"
              icon={<ArrowUpOutlined rotate={90} />}
              loading={
                currentFinancialSummary?.isLoading ||
                paymentsQuery?.isLoading ||
                expensesQuery?.isLoading ||
                unpaidStudentsQuery?.isLoading ||
                deleteExpenseMutation?.isLoading ||
                deletePaymentMutation?.isLoading ||
                createPaymentMutation?.isLoading
              }
              color='blue'
            >
              Yangilash
            </Button>
          </Col>
        </Row>
      </Card>

      <Tabs activeKey={activeTab} className="mt-2" onChange={(key) => setActiveTab(key)} type="card">
        <TabPane tab="Umumiy To'lovlar" key="1">
          <h3 className="text-xl font-extrabold">Barcha To'lovlar</h3>
          <Table
            columns={paymentColumns}
            dataSource={allPayments}
            loading={paymentsQuery?.isLoading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>

        <TabPane tab="Oylik To'lovlar" key="2">
          <h3 className="text-xl font-extrabold">
            <span className="text-amber-600">{currentYear} - {currentMonth}</span> uchun To'lovlar
          </h3>
          <Table 
            columns={paymentColumns} 
            dataSource={paymentsByMonth?.data ?? []} 
            loading={paymentsByMonth?.isLoading}
            rowKey="id" 
            scroll={{ x: 'max-content' }} 
          />
        </TabPane>

        <TabPane tab="To'lanmagan Talabalar" key="3">
          <h3 className="text-xl font-extrabold">
            <span className="text-amber-600">{currentYear} - {currentMonth}</span> uchun To'lanmagan Talabalar
          </h3>
          <Table
            columns={unpaidStudentsColumns}
            dataSource={unpaidStudents}
            loading={unpaidStudentsQuery?.isLoading}
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
            dataSource={allExpenses}
            loading={expensesQuery?.isLoading}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
      </Tabs>
      {branchId &&
      <AddExpenseModal 
        isVisible={isAddExpenseModalVisible} 
        onClose={() => setIsAddExpenseModalVisible(false)} 
        branchId={branchId} 
      />
    }
    </div>
  );
};

export default Payment;