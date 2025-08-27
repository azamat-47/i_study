import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { Avatar, Button, Input, Layout, Menu, Popconfirm, theme, Tooltip, Grid } from 'antd';
import { PiStudentFill } from 'react-icons/pi';
import { MdGroups3, MdPayment } from 'react-icons/md';
import { RiInfoCardLine, RiMenuFold2Fill, RiMenuUnfold2Fill } from 'react-icons/ri';
import { FaUserNurse } from 'react-icons/fa';
import { CiSquareChevLeft } from 'react-icons/ci';

const { Search } = Input;
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
import useAuth from './hooks/useAuth';

import main_logo from "./assets/mainLogo.png"
import { GiTeacher } from 'react-icons/gi';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { logout } = useAuth();
  
  

  const location = useLocation();
  const screens = useBreakpoint();

  useEffect(() => {
    setIsMobile(!screens.md);
  }, [screens]);

  const handleConfirm = () => {
    logout();
  };

  const menuItems = [
    { key: '/', icon: <MdGroups3 size={20} />, link: "/", title:"Guruhlar" },
    { key: '/tolovlar', icon: <MdPayment size={20} />, link: "/tolovlar" , title:"To'lovlar" },
    { key: '/uqituvchilar', icon: <GiTeacher size={20} />, link: "/uqituvchilar", title: "Ustozlar" },
    { key: '/uquvchilar', icon: <PiStudentFill size={20} />, link: "/uquvchilar", title:"O'quvchilar" },
    { key: '/sayt_haqida', icon: <RiInfoCardLine size={20} />, link: "/sayt_haqida", title: "Sayt haqida" },
  ];

  return (
    <Layout className='min-h-[100vh]'>
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider trigger={null} collapsible collapsed={collapsed} className='min-h-[64px] bg-[#141414]!'>
          <div className="flex items-center justify-center h-16">
            <img src={main_logo} alt="Logo" className="h-10 w-10" />
            {!collapsed && <span className="ml-2 text-lg font-black ">I_Study</span>}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.link}>{item.title}</Link>
            }))}
            
            className='h-full bg-[#141414]!'
          />
        </Sider>
      )}

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className='flex items-center gap-4 justify-between'>

          {!isMobile && (
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
          )}

          {/* <Search placeholder="O'quvchilarni qidirish..." onSearch={null} enterButton className='md:w-1/2! ml-3' /> */}

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
            margin: isMobile ? '10px' : '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>

        {/* 📱 Mobile Bottom Icon Tabs */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 w-full bg-[#141414] flex justify-around py-2">
            {menuItems.map(item => (
              <Link
                key={item.key}
                to={item.link}
                className={`p-2 ${location.pathname === item.key ? "text-blue-500!" : "text-gray-500!"}`}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        )}
      </Layout>
    </Layout>
  );
};

export default App;
