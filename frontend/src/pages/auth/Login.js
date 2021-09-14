import React, { useState } from 'react';
import { Input, message, Spin } from 'antd';
import { KeyOutlined, LoadingOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { isAuthenticated, setAuthentication } from '../../components/auth/auth';

export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',

  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  const success = (msg) => {
    message.success({
      content: msg,
      className: 'custom-class',
      style: {
        position: 'absolute',
        top: '15vh',
        right: '0px'
      },
    });
  };
  const error = (msg) => {
    message.error({
      content: msg,
      className: 'custom-class',
      style: {
        position: 'absolute',
        top: '15vh',
        right: '0px'
      },
    });
  };

  const onFinish = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios.post('/api/users/login', {email, password}).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setAuthentication(res.data, res.data.token);
        success(res.data.successMessage);
        props.history.push('/');
        window.location.reload();
      }
      else if (res.status === 201) {
        error(res.data.errorMessage);
      }
      else {
        error(res.data.errorMessage);
      }
    })

  };


  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;

  return (

    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>
      {
        !isAuthenticated() ?
          loading
            ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '200px' }}>
              <Spin indicator={antIcon} />
            </div>
            :
            <>
          <div className='auth-form'>
            <div className='auth-form-inner'>
                    <div style={{ padding: '60px' }}>
                      <div className='login-right text-center'>
                        <div>
                         <div className = 'mb-3 text-center ml-4'>
                          <Link style={{ color: 'rgba(130, 36, 227, 0.8)', fontSize: '32px', fontWeight: '700', paddingBottom: '300px' }} to="/">Timble</Link>
                          </div>                         
                           <p className='mb-2' style={{ fontSize: '20px', fontWeight: '680', color: '#424553' }}>Welcome!</p>
                          <p>Join gazillions of people online</p>
                          <form onSubmit={onFinish}>
                            <div className="floating-label-group mb-3">
                              <Input name='email' onChange={handleChange} size='small' placeholder="Email or Username" prefix={<UserOutlined />} />
                            </div>
                            <div className="floating-label-group">
                              <Input.Password name='password' type='password' onChange={handleChange} size="small" placeholder="Password" prefix={<KeyOutlined />} />
                            </div>
                            <div className = 'd-flex justify-content-between mt-2'>
                            <div>
                              <label className="form-check-label float-left mt-1 ml-2">
                                <input className="form-check-input" type="checkbox" /> Remember
                              </label>
                            </div>
                            <div>
                              <Link className='pass' to = '/reset-password'>Lost Password?</Link>
                            </div>
                            </div>
                           

                            <button type='submit' className='btn my-2 mt-3 w-100' style={{ padding: '10px', background: 'rgba(130, 36, 227, 0.8)', color: 'white', borderRadius: '23px' }}>
                              Login
                            </button>
                          </form>
                          <div className='mt-2'>
                            <p>
                              New to <strong>Timble?</strong> <Link to='/signup' style={{ color: 'rgba(130, 36, 227, 0.8)', fontWeight: '631' }}>Register</Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
            </div>
          </div>
          </>
          :
          <div className='text-center' style={{ marginTop: '50vh' }}>
            <h4>
              <LoginOutlined /> <br />
              You are already Logged in!
            </h4>
            <Link to='/' className='btn my-2 mt-2' style={{ width: '202px', background: 'rgba(130, 36, 227, 0.8)', color: 'white' }}>Go to Home</Link>
          </div>

      }
    </div>

  );
}
