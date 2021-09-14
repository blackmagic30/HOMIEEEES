import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import axios from 'axios';
import { Spin } from 'antd';
import { ContactsOutlined, KeyOutlined, LoadingOutlined, LoginOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import 'antd/dist/antd.css';
import { isAuthenticated } from '../../components/auth/auth';


export const Signup = (props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confimPassword: '',
    phone: ''
  });

  const { fullName, username, email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }


  const handleImageChange = (e) => {
    setFile(
       e.target.files[0]
    );
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
  const onFinish = async (e) => {
    window.scrollTo(0, 0);
    setLoading(true);
    let data = new FormData();
    data.append('fullName', fullName);
    data.append('email', email);
    data.append('username', username);
    data.append('password', password);
    data.append('file', file);

    await axios.post('/api/users/signup', data).then(res => {
      setLoading(false);
      if (res.status === 200) {
        success(res.data.successMessage);
        setTimeout(() => {
          props.history.push('/login')

        }, 2000);
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
    loading
      ?
      <div className='text-center fixed-top' style={{ marginTop: '50vh' }}>
        <Spin indicator={antIcon} />
      </div>

      :

      <div>
        <Helmet>
          <title>Signup</title>
        </Helmet>
        {
          !isAuthenticated()

            ?

            <div className='auth-form'>
              <div className='auth-form-inner'>
                <div className='signup-right text-center'>
                  <div className = 'px-5'>
                    <div className = 'mb-3 text-center ml-4'>
                    <Link style={{ color: 'rgba(130, 36, 227, 0.8)', fontSize: '32px', fontWeight: '700', paddingBottom: '300px' }} to="/">Timble</Link>
                    </div>
                    <p>Join gazillions of people online</p>
                    <Form
                      name="basic"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                    >
                      <div className="floating-label-group">
                        <Form.Item
                          name="Full Name"
                          rules={[{ required: true, message: 'Please input your Full Name!' }]}
                        >
                          <Input name='fullName' onChange={handleChange} size='small' placeholder="Full Name" prefix={<ContactsOutlined />} />
                        </Form.Item>
                      </div>
                      <div className="floating-label-group">
                        <Form.Item
                          name="username"
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input name='username' type='text' onChange={handleChange} size="small" placeholder="Username" prefix={<UserOutlined />} />
                        </Form.Item>
                      </div>
                      <div className="floating-label-group">
                        <Form.Item
                          name="email"
                          rules={[
                            {
                              type: 'email',
                              message: 'The input is not valid E-mail!',
                            },
                            {
                              required: true,
                              message: 'Please input your E-mail!',
                            },
                          ]}
                        >
                          <Input name='email' onChange={handleChange} size='small' placeholder="Email" prefix={<MailOutlined />} />
                        </Form.Item>
                      </div>
                      <div className="floating-label-group">
                        <Form.Item
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your password!',
                            },
                          ]}
                          hasFeedback
                        >
                          <Input.Password type='password' name='password' onChange={handleChange} size="small" placeholder="Password" prefix={<KeyOutlined />} />
                        </Form.Item>
                      </div>
                      <div className="floating-label-group">
                        <Form.Item
                          name="confirm"
                          dependencies={['password']}
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password name='confimPassword' onChange={handleChange} size='small' placeholder="Re-Enter Password" prefix={<KeyOutlined />} />
                        </Form.Item>
                      </div>
                      <div className="floating-label-group my-3">
                      <label for="formFile" className="form-label mb-2 fw-bolder">Select profile picture</label>
                      <input className="form-control" type = 'file' name = 'file' onChange = {handleImageChange} id="formFile" required/>
                      </div>
                      <span>
                        <label className="form-check-label float-left mt-1 ml-2">
                          <input className="form-check-input" type="checkbox" /> Remember
                        </label>
                      </span>
                      <button type='submit' className='btn my-2 mt-3 w-100' style={{ padding: '10px', background: 'rgba(130, 36, 227, 0.8)', color: 'white', borderRadius: '23px' }}>
                        Create Account
                      </button>
                    </Form>
                    <div className='mt-2'>
                      <p>
                        Already Have Account? <Link to='/login' style={{ color: 'rgba(130, 36, 227, 0.8)', fontWeight: '631' }}>Login</Link>
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            :

            <div className='text-center' style={{ marginTop: '50vh' }}>
              <h4>
                <LoginOutlined /> <br />
                You are already Logged in!
              </h4>
              <Link to='/' className='btn my-2 mt-2' style={{ width: '300px', background: '#ff3f6c', color: 'white' }}>Go to Home</Link>
            </div>
        }
      </div>
  );
};
