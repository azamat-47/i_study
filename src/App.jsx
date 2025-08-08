import React, { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { Avatar, Button, Input, Layout, Menu, Popconfirm, theme, Tooltip } from 'antd';
import { AiFillHome, AiFillSetting } from 'react-icons/ai';
import { PiStudentFill } from 'react-icons/pi';
import { MdGroups3, MdPayment } from 'react-icons/md';
import { RiMenuFold2Fill, RiMenuUnfold2Fill } from 'react-icons/ri';
import { FaUserNurse } from 'react-icons/fa';
import { CiSquareChevLeft } from 'react-icons/ci';
const { Search } = Input;

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  const handleConfirm = () => {
    console.log('Confirmed exit');
    // Here you can handle navigation, logout, etc.
  };


  return (
    <Layout className='min-h-[100vh]!' >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical " />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // Hozirgi yo'lni tanlab turish
          items={[
            {
              key: '/',
              icon: <MdGroups3 size={20} />,
              label: <Link to="/">Guruhlar</Link>,
            },
            {
              key: '/payment',
              icon: <MdPayment size={20} />,
              label: <Link to="/payment">To'lovlar</Link>,
            },
            {
              key: '/students',
              icon: <PiStudentFill size={20} />,
              label: <Link to="/students">O'quvchilar</Link>,
            },
            {
              key: '/settings',
              icon: <AiFillSetting size={20} />,
              label: <Link to="/settings">Sozlamalar</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className='flex items-center gap-4 justify-between'>
          <Button
            type="text"
            icon={collapsed ? <RiMenuFold2Fill /> : <RiMenuUnfold2Fill />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <Search placeholder="O'quvchilarni qidirish..." onSearch={null} enterButton className='w-1/2!' />

          <div className='flex items-center gap-3'>
            <Popconfirm
              title="Rostdan ham chiqib ketmoqchimisiz?"
              okText="Ha"
              cancelText="Yo'q"
              onConfirm={handleConfirm}
            >
              <Tooltip title="Chiqish" placement="bottom">
                <Button
                  shape="circle"
                  icon={<CiSquareChevLeft color="white" />}
                  danger
                  className="!bg-red-700"
                />
              </Tooltip>
            </Popconfirm>

            <Tooltip title="Profil" placement="bottom">              
              <Avatar shape='square' size="large" icon={<FaUserNurse />} className='mr-3! cursor-pointer' />
            </Tooltip>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
