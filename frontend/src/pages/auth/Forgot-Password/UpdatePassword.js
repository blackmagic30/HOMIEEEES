import { Button, Input, message } from "antd";
import {Form} from "antd";
import axios from "axios";
import React, { useState } from "react";

export const UpdatePassword = (props) => {
  const [form] = Form.useForm();
  const token = props.match.params.token;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true)
    await axios.post(`/api/users/update-password`, { password: password, confirm: confirm, token }).then((res) => {
      if (res.status === 200) {
        message.success({
          content: res.data.successMessage,
          style: {
            marginTop: "15vh",
          },
        });
        setLoading(false);
         props.history.push('/login');
      } 
       else if(res.status === 201) {
        setLoading(false);
        message.error({
          content: res.data.errorMessage,
          style: {
            marginTop: "15vh",
          },
        });
      }
      else {
        message.error({
          content: res.data.errorMessage,
          style: {
            marginTop: "15vh",
          },
        });
      }
    });
  };
  return (
    <div>
      <div className="form new-password">
        <div className="login-inner text-center" style={{ paddingTop: "20vh" }}>
          <h4>Enter New Password</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="w-100"
          >
            {/* <form onSubmit={submitHandler} className = 'w-100'>
              <div className="floating-label-group">
                 <input onChange = {handleChange} name = 'email' type="text" id="email" className="form-control" autofocus required />
                     <label className="floating-label">Email or Username</label>
                     </div>
          <button type = 'submit' className = 'btn my-2 mt-2 w-50' style = {{height: '41px', background: '#ff3f6c', color: 'white'}}>
             Update 
          </button>
      </form> */}
            <Form
              form={form}
              name="register"
              scrollToFirstError
            >
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password onChange = {(e) => setPassword(e.target.value)} placeholder = 'Enter new password'/>
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password onChange = {(e) => setConfirm(e.target.value)} placeholder = 'Re-Enter new password'/>
              </Form.Item>
              <Button loading = {loading} onClick = {submitHandler} type = 'submit' className = 'btn my-2 mt-2 w-50' style = {{height: '41px'}}>
                    Update 
                </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
