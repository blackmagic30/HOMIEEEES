import React from 'react'
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import Sider from 'antd/lib/layout/Sider';
import { NavLink } from 'react-router-dom';

export const AdminSideBar = () => {
    return (
        <div>
            <Sider
                style={{  
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0
                }}
                >
                <div className="logo" />
                <Menu mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="10">
                    <NavLink activeClassName = 'active-side' to = '/admin/users'>Users</NavLink>
                </Menu.Item>
                <Menu.Item key="7">
                    <NavLink to = '/admin/subjects'>Subjects </NavLink>
                </Menu.Item>
                </Menu>
                </Sider>
                           
        </div>
    )
}
