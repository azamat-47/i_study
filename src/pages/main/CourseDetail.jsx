import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Descriptions, Tag, Space, Avatar, Divider, Tooltip } from 'antd';
import { ArrowLeftOutlined, UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import useCourse from '../../hooks/useCourse';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useCourse();
  
  const courseQuery = getCourseById(id);

  if (courseQuery.isLoading) return <p>Yuklanmoqda...</p>;
  if (courseQuery.isError) return <p>Error: {courseQuery.error.message}</p>;

  const course = courseQuery.data;

  const studentColumns = [
    {
      title: 'Avatar',
      key: 'avatar',
      width: 60,
      render: (_, record) => (
        <Avatar 
          size={40} 
          // icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        >
          {record.name.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Ism',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          <span>{email}</span>
        </Space>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Space>
          <PhoneOutlined style={{ color: '#52c41a' }} />
          <span>{phone}</span>
        </Space>
      ),
    },
    {
      title: "Ro'yxatdan o'tgan sana",
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: '#faad14' }} />
          <Tag color="blue">{date}</Tag>
        </Space>
      ),
    },
  ];

  const teacherColumns = [
    {
      title: 'Avatar',
      key: 'avatar',
      width: 60,
      render: (_, record) => (
        <Avatar 
          size={40} 
          icon={<UserOutlined />}
          style={{ backgroundColor: '#52c41a' }}
        >
          {record.name.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Ism',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          <span>{email}</span>
        </Space>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Space>
          <PhoneOutlined style={{ color: '#52c41a' }} />
          <span>{phone}</span>
        </Space>
      ),
    },
    {
      title: 'Maosh',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) => (
        <Space>
          <DollarOutlined style={{ color: '#fa8c16' }} />
          <Tag color="gold">{salary?.toLocaleString()} so'm</Tag>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Header with back button */}
      <div style={{ marginBottom: '20px' }}>
        <Tooltip title="Guruhlar Sahifasi">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            style={{ marginBottom: '16px' }}
          >
            Orqaga
          </Button>
        </Tooltip>
      </div>

      {/* Course Info Card */}
      <Card 
        title={
          <div style={{ fontSize: '24px', color: '#1890ff' }}>
            📚 {course.name}
          </div>
        }
        style={{ marginBottom: '20px' }}
        extra={
          <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
            ID: {course.id}
          </Tag>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Kurs nomi" span={2}>
            <strong style={{ fontSize: '16px' }}>{course.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Ta'rif" span={2}>
            {course.description}
          </Descriptions.Item>
          <Descriptions.Item label="Narx">
            <Tag color="gold" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {course.fee?.toLocaleString()} so'm
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Talabalar soni">
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {course.students?.length || 0} ta
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="O'qituvchilar soni">
            <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {course.teachers?.length || 0} ta
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Teachers Section */}
      <Card 
        title={
          <div style={{ fontSize: '18px' }}>
            👨‍🏫 O'qituvchilar ({course.teachers?.length || 0})
          </div>
        }
        style={{ marginBottom: '20px' }}
      >
        <Table
          dataSource={course.teachers}
          columns={teacherColumns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "O'qituvchilar mavjud emas" }}
        />
      </Card>

      {/* Students Section */}
      <Card 
        title={
          <div style={{ fontSize: '18px' }}>
            👨‍🎓 Talabalar {course.students?.length || 0} -nafar
          </div>
        }
      >
        <Table
          dataSource={course.students}
          columns={studentColumns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} ta talaba`,
          }}
          locale={{ emptyText: "Talabalar mavjud emas" }}
        />
      </Card>
    </div>
  );
};

export default CourseDetail;