import React, { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button, Layout, Menu, theme } from 'antd';
import { AiFillHome, AiFillSetting } from 'react-icons/ai';
import { PiStudentFill } from 'react-icons/pi';
import { MdGroups3 } from 'react-icons/md';
import { RiMenuFold2Fill, RiMenuUnfold2Fill } from 'react-icons/ri';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  return (
    <Layout >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical "  />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // Hozirgi yo'lni tanlab turish
          items={[
            {
              key: '/',
              icon: <AiFillHome />,
              label: <Link to="/">Asosiy</Link>,
            },
            {
              key: '/payment',
              icon: <MdGroups3 />,
              label: <Link to="/payment">To'lovlar</Link>,
            },
            {
              key: '/students',
              icon: <PiStudentFill />,
              label: <Link to="/students">O'quvchilar</Link>,
            },
            {
              key: '/settings',
              icon: <AiFillSetting/>,
              label: <Link to="/settings">Sozlamalar</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <RiMenuFold2Fill /> :  <RiMenuUnfold2Fill />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 580,
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
