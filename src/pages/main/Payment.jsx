import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, DatePicker, Space, Statistic, Row, Col, Table, Typography } from 'antd';
import { PlusOutlined, CalendarOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useReports from '../../hooks/useReports';
import usePayment from '../../hooks/usePayment';
import useExpenses from '../../hooks/useExpenses';
import useStudents from '../../hooks/useStudents'; // useStudents hookini import qilamiz
import AddPaymentModal from '../../components/modals/payment/AddPaymentModal';
import AddExpenseModal from '../../components/modals/payment/AddExpenseModal';
import TagUi from '../../components/ui/Tag';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const Payment = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [branchId, setBranchId] = useState(null);
  const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] = useState(false);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);

  // Sana filtrlash uchun state'lar
  const [filterType, setFilterType] = useState('month'); // 'day', 'month', 'range'
  const [selectedDate, setSelectedDate] = useState(dayjs()); // dayjs object for 'day' and 'month'
  const [selectedRange, setSelectedRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]); // [startDate, endDate] for 'range'

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
    paymentRangeReportQuery,
    monthlyPaymentReportQuery,
    dailyPaymentReportQuery,
    expenseRangeReportQuery,
    monthlyExpenseReportQuery,
    dailyExpenseReportQuery,
  } = useReports(branchId);

  // Payment hook
  const { paymentsQuery, paymentsByMonthQuery } = usePayment(branchId);

  // Expenses hook
  const { expensesQuery } = useExpenses(branchId);

  // Students hook (To'lanmagan talabalar uchun)
  const { unpaidStudentsQuery } = useStudents(branchId);


  // Dinamik ravishda query parametrlarni aniqlash
  const currentYear = selectedDate.year();
  const currentMonth = selectedDate.month() + 1; // month is 0-indexed
  const currentDay = selectedDate.format('YYYY-MM-DD');

  const rangeStartDate = selectedRange[0]?.format('YYYY-MM-DD');
  const rangeEndDate = selectedRange[1]?.format('YYYY-MM-DD');

  // Hisobotlarni yuklash
  const financialSummaryMonth = financialSummaryQuery({ year: currentYear, month: currentMonth });
  const financialSummaryRange = financialSummaryRangeQuery({ startDate: rangeStartDate, endDate: rangeEndDate });

  const paymentMonth = paymentsByMonthQuery({ branchId, year: currentYear, month: currentMonth }).data


  const expenseReportRange = expenseRangeReportQuery({ startDate: rangeStartDate, endDate: rangeEndDate });
  const monthlyExpenseReport = monthlyExpenseReportQuery({ year: currentYear, month: currentMonth });
  const dailyExpenseReport = dailyExpenseReportQuery({ date: currentDay });

  const allPayments = paymentsQuery.data; // Umumiy to'lovlar uchun
  const allExpenses = expensesQuery.data; // Umumiy xarajatlar uchun

  // To'lanmagan talabalar
  const unpaidStudents = unpaidStudentsQuery(currentYear, currentMonth);


  // Qaysi hisobotni ko'rsatishni aniqlash
  const currentFinancialSummary = filterType === 'range' ? financialSummaryRange : financialSummaryMonth;

  // To'lovlar uchun jadval ustunlari
  const paymentColumns = [
    {
      title: 'Talaba',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Kurs',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <TagUi>{amount} so'm</TagUi>,
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
      render: (coment) => coment.substring(0, 30)
    },
  ];

  // Xarajatlar uchun jadval ustunlari
  const expenseColumns = [
    {
      title: 'Kategoriya',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Miqdor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount} UZS`,
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
      key: 'description',
    },
  ];

  // To'lanmagan talabalar uchun jadval ustunlari
  const unpaidStudentsColumns = [
    {
      title: 'Talaba',
      key: 'fullName',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Sana',
      dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Kurs',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'To\'lanishi kerak bo\'lgan miqdor',
      dataIndex: 'unpaidAmount', // Bu maydon backend'dan kelishi kerak
      key: 'unpaidAmount',
      render: (amount) => amount ? `${amount} UZS` : 'Noma\'lum',
    },
  ];


  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilterType('day'); // Agar bitta sana tanlansa, kunlik filtrga o'tish
  };

  
  return (
    <div >
      <Title level={2}>Moliyaviy Boshqaruv</Title>

      <Card >





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
                value={currentFinancialSummary.data?.totalPayments || 0}
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
        </Row>
      </Card>

      <Tabs activeKey={activeTab} className='mt-2' onChange={setActiveTab} type="card">
        <TabPane tab="Umumiy To'lovlar" key="1">
          <div className="flex justify-between">
            <h3 className='text-xl font-extrabold'>Barcha To'lovlar</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddPaymentModalVisible(true)}
              style={{ marginBottom: 16 }}
            >
              To'lov qo'shish
            </Button>
          </div>
          <Table
            columns={paymentColumns}
            dataSource={allPayments || []}
            loading={paymentsQuery.isLoading}
            rowKey="_id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>

        <TabPane tab="Oylik To'lovlar" key="2">
          <div className="flex justify-between">
            <h3 className='text-xl font-extrabold'><span className='text-amber-600'>{currentYear} - {currentMonth}</span> uchun To'lovlar</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddPaymentModalVisible(true)}
              style={{ marginBottom: 16 }}
            >
              To'lov qo'shish
            </Button>
          </div>
          <Table
            columns={paymentColumns}
            dataSource={paymentMonth || []}
            rowKey="_id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>

        <TabPane tab="To'lanmagan Talabalar" key="3">

          
            {console.log(unpaidStudents.data) }
            <h3 className='text-xl font-extrabold'><span className='text-amber-600'>{currentYear} - {currentMonth}</span> uchun To'lanmagan Talabalar</h3>

          

          <Table
            columns={unpaidStudentsColumns}
            dataSource={unpaidStudents.data}
            loading={unpaidStudents.isLoading}
            rowKey="_id"
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
            rowKey="_id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>

        <TabPane tab="Oylik Xarajatlar" key="5">
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
            dataSource={(filterType === 'day' ? dailyExpenseReport.data : monthlyExpenseReport.data) || []}
            loading={dailyExpenseReport.isLoading || monthlyExpenseReport.isLoading}
            rowKey="_id"
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
      </Tabs>

      <AddPaymentModal
        isVisible={isAddPaymentModalVisible}
        onClose={() => setIsAddPaymentModalVisible(false)}
        branchId={branchId}
      />

      <AddExpenseModal
        isVisible={isAddExpenseModalVisible}
        onClose={() => setIsAddExpenseModalVisible(false)}
        branchId={branchId}
      />
    </div>
  );
};

export default Payment;