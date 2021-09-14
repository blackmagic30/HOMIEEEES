import 'antd/dist/antd.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { isAuthenticated, logout } from '../auth/auth';

export const Navbar = () => {

  const menu = (
    <div className='navMenu'>
      {
        isAuthenticated()
          ?
          <Menu>
             <Menu.Item key = '1'>
              <h6 className = 'p-2 bg-light'>
                {isAuthenticated().fullName}
              </h6>
            </Menu.Item>
             <Menu.Item key = '2'>
              <Link to= {'/profile/' + isAuthenticated()._id}>
                Profile
              </Link>
            </Menu.Item>
            {
              isAuthenticated().role === 1 &&
              <Menu.Item key = '3'>
              <Link to= '/admin/users'>
                  Dashboard
              </Link>
            </Menu.Item>
            }
            <Menu.Item key = '4'>
              <a href='/login' onClick={(e) => { logout(() => { }) }}>
                Logout
              </a>
            </Menu.Item>
          </Menu>

          :
          <Menu style={{ padding: '10px', textAlign: 'center' }}>
            <h6>Welcome</h6>
            <Menu.Item>
              <Link to="/login" className='px-4 login-btn' style={{ border: '1px solid rgba(130, 36, 227, 0.8)', color: 'rgba(130, 36, 227, 0.8)', padding: '8px', fontWeight: '500', fontSize: '14px' }}>
                Login/Signup
              </Link>

              <div style={{ borderBottom: '1px solid #eaeaec', paddingTop: '20px' }}></div>
            </Menu.Item>
          </Menu>
      }
    </div>
  )
  return (
    <div className='main-nav'>
      <nav className="navbar fixed-top">
        <Link className="navbar-brand" to="/" style={{ color: 'rgba(130, 36, 227, 0.8)', fontSize: '43px', fontWeight: '700' }}>Timble</Link>
        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <div>
          <ul className="navbar-nav ml-auto mr-5 list-unstyle pt-3" style={{ fontSize: '12px' }}> 
            <li className='nav-item profile' style={{ fontWeight: 'normal' }}>
              <Dropdown overlay={menu}>
                {
                  isAuthenticated()
                    ?
                    <Link>
                      <img src={isAuthenticated().image} width='43' height = '43' alt = 'image' className='rounded-circle' />
                    </Link>
                    :
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      <UserOutlined style={{ fontSize: '21px', paddingLeft: '10px', color: 'black' }} />
                      <br />
                      <span style={{ fontSize: '14px', color: 'black' }}>Profile</span>
                    </a>
                }
              </Dropdown>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
