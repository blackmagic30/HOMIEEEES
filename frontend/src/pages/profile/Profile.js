import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Row, Spin, message } from 'antd';
import { DeleteOutlined, LoadingOutlined} from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../components/auth/auth';

export const Profile = (props) => {
    useEffect(() => {
        if (window.location.href.includes('confirm-email')) {
            return true;
        }
        else if (isAuthenticated().verification == false) {
            props.history.push('/verify-email');
        } else {
            return true;
        }

        return () => {

        }
    }, []);
    const userId = props.match.params.id;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState('');
    const [file, setFile] = useState('');
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        username: '',
        role: ''       
    });

    const [password, setPassword] = useState({
      newPassword: '',
      confirmNewPassword: '',
  });
    
    const handleEditUserChange = (e) => {
        setUser({
            ...user,
            [e.target.name] : e.target.value
        });
    }
    const handleImageChange = (e) => { 
        setFile(
          e.target.files[0]
    
        )
      }

      const handlePasswordChange = (e) => {
        setPassword({
          ...password,
        [e.target.name] : e.target.value
        });
      }

      const removeImage = () => {
        setImage('');
      }


      const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        getUserById();
        return () => {
            
        }
    }, [success]);

    useEffect(() => {
      !isAuthenticated() && props.history.push('/login');
      if(window.location.href.includes('confirm-email')) {
          return true;
      }
        else if(isAuthenticated().verification == false) {
           props.history.push('/verify-email');
      } else {
        return true;
      }
  
      return () => {

      }
  }, []);

    const getUserById = async() => {
        await axios.get(`/api/users/get/${userId}`, {headers : {
          authorization : 'Bearer ' + localStorage.getItem('token')
        }}).then(res => {
          if(res.status === 200) {
            setUser(res.data);
            setImage(res.data.image)
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
    }

  /***************************************** Submit Handler ***************************************************/
    const handleSubmit = async() => {
        setLoading(true);
        let data = new FormData();
        data.append('fullName', user.fullName);
        data.append('email', user.email);
        data.append('username', user.username);
        if(file) {
        data.append('file', file);
        } 
        if(image) {
        data.append('image', image);
        }
        await axios.post(`/api/users/edit/${userId}`, data, {headers : {
          'authorization' : 'Bearer ' + localStorage.getItem('token')
        }}).then(res => {
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
    }

    const submitPasswordHandler = async(e) => {
      e.preventDefault();
      if(password.newPassword !== password.confirmNewPassword) {
      } else {
      await axios.post(`/api/users/admin/change/password/${userId}`, {newPassword: password.newPassword, confirmNewPassword: password.confirmNewPassword} , {headers : {
          'authorization' : 'Bearer ' + localStorage.getItem('token')
        }}).then(res => {
          if(res.status === 200) {
            setLoading(false);
            message.success({
              content: res.data.successMessage,
              style: {
                marginTop: '20vh',
              },
            });
          } else {
            message.error({
              content: res.data.errorMessage,
              style: {
                marginTop: '20vh',
              },
            });
          }
      });
  }
}

    const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
    return (
        <div className = 'd-flex justify-content-center'>
            {  loading &&
            <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
            <Spin indicator={antIcon} />
            </div>
               }
              <Form className = 'editUserForm w-25' style = {{marginTop: '100px'}}>
              <Row>
              <Col span={24} style = {{paddingLeft: '23px', marginBottom : '23px'}}>
                {
                  image &&
                  <React.Fragment>
                  <div>
                <DeleteOutlined onClick = {() => removeImage()} style = {{paddingLeft: '180px'}}/>
                </div>
                <img src = {image} width = '180' height = '200'/>
                </React.Fragment>
                }
               {
                 !image && 
                 <div className="custom-file" style = {{marginLeft: '120px'}}>
                <input type="file" name = 'file' required onChange = {handleImageChange}/>
                <label className="custom-file-label" for="customFile"></label>
                </div>
               }
                
                
              </Col>
              <Col span={24} style = {{paddingLeft: '23px'}}>
               <h6>Full Name:</h6>
              <Input style = {{marginBottom: '23px'}} name = 'fullName' onChange= {handleEditUserChange} value={user.fullName}/>
              </Col>
              <Col span={24} style = {{paddingLeft: '23px'}}>
              <h6>Email:</h6>
              <Input style = {{marginBottom: '23px'}} name = 'email' onChange= {handleEditUserChange} value={user.email}/>
              </Col>
              <Col span={24} style = {{paddingLeft: '23px'}}>
              <h6>Username:</h6>
              <Input style = {{marginBottom: '23px'}} name = 'username' onChange= {handleEditUserChange} value={user.username}/>
              </Col>
              <Col className = 'text-center' span={24} style = {{paddingLeft: '23px', marginTop: '23px'}}>
              <Button onClick = {handleSubmit} type = 'primary'>Submit</Button>
                    <div className = 'px-5 mt-4'>
                       <Link onClick = {showModal} className = 'btn submit-btn bg-white border-secondary text-dark font-weight-bolder'>Change Passsword</Link> 
                       </div>  
                       <Modal width = {460} footer = {false} title="Change Password" visible={isModalVisible} onCancel={handleCancel}>
                               <div className = 'address edit-profile password-modal mx-4'>
                                  <form onSubmit = {submitPasswordHandler}>
                                   <div className="floating-label-group">
                                   <label className="floating-label">New Password*</label>
                                   <Input.Password onChange = {handlePasswordChange} name = 'newPassword' className="form-control"/>
                                   </div>
                                   <div className="floating-label-group mt-2">
                                   <label className="floating-label">Confirm New Password*</label>
                                   <Input.Password onChange = {handlePasswordChange} name = 'confirmNewPassword' className="form-control" autocomplete="off" autofocus required/>
                               </div>
                               <div className = 'mt-4 text-center'>
                                  <button className = 'btn submit-btn btn-outline-dark w-50' type = 'submit'>Change</button> 
                                  </div>  
                                  {/* <div className = 'mt-4'>
                                  <Link onClick = {() => setIsModalVisible(false)} className = 'btn submit-btn bg-white border-secondary text-dark font-weight-bolder'>Cancel</Link> 
                                  </div>   */}
                                  </form>
                               </div>
                          </Modal>
              </Col>
              </Row>
           
              </Form>
              </div>
    )
}
