import React, { useState } from 'react';
import { Form, Input, Button, Drawer, message } from 'antd';
import axios from 'axios';
import { Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export const CreateUsers = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const handleImageChange = (e) => { 
    setFile(
      e.target.files[0]

    )
  }

  const showDrawer = () => {
    setVisible(true);
  };

 const onClose = () => {
    setVisible(false);
  };

  const onFinish = async (values) => {
    window.scrollTo(0, 0);
    setLoading(true);
    let data = new FormData();
    data.append('fullName', values.fullName);
    data.append('email', values.email);
    data.append('username', values.username);
    data.append('password', values.password);
    data.append('confirm', values.confirm);
    data.append('file', file);
     
     await axios.post(`/api/users/signup`, data).then(res => {
         setLoading(false);
         if(res.status === 200) {
          message.success({
            content: res.data.successMessage,
            style: {
              marginTop: '20vh',
            },
          });
         }
        else if(res.status === 201) {
          message.error({
            content: res.data.errorMessage,
            style: {
              marginTop: '20vh',
            },
          });
          }
          else {
            message.error({
              content: res.data.errorMessage,
              style: {
                marginTop: '20vh',
              },
            });
          }
     })

  };

  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;

  return (
      loading 
      ?
      <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
      <Spin indicator={antIcon} />
      </div>

      :
      
     <React.Fragment>
       <Button size = "middle" icon = {<PlusOutlined />} onClick = {showDrawer}>Create New User</Button>
       <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
      <div style = {{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '100px'}}>
        <div>
        <h2 className = 'text-center ml-5 my-4'>Create New User Account</h2>
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[
          {
            required: true,
            message: 'Please input your Full Name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
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
        <Input />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
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

              return Promise.reject(new Error("The two passwords you entered don't match."));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <div className="custom-file" style = {{marginLeft: '120px'}}>
      <input type="file" name = 'file' required multiple onChange = {handleImageChange}/>
      <label className="custom-file-label" for="customFile"></label>
      </div>
      <Form.Item {...tailFormItemLayout}>
        <Button htmlType="submit" className = 'w-100'>
          Register 
        </Button>
      </Form.Item>

 
    </Form>
    </div>
    </div>  
    </Drawer>
    </React.Fragment>
  );
};
