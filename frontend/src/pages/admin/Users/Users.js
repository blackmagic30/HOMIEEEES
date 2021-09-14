import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Drawer, Col, Row, Spin, message } from 'antd';
import {EyeOutlined, EditOutlined, DeleteOutlined, LoadingOutlined} from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';
import { CreateUsers } from '../../../components/admin/Users/CreateUsers';
import { isAuthenticated } from '../../../components/auth/auth';

export const Users = (props) => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ProductId, setProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
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
  
    const showDrawer = () => {
        setVisible(true);
      };
    
     const onClose = () => {
        setVisible(false);
      };
      const showEditDrawer = () => {
        setEditVisible(true);
      };
    
     const onEditClose = () => {
        setEditVisible(false);
      };

      const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    
      const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
          <p className="site-description-item-profile-p-label" style = {{marginBottom: '0px', fontWeight: 'bolder', marginTop: '19px'}}>{title}:</p>
          {content}
        </div>
      );

    useEffect(() => {
        getUsers();
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

    const getUsers = async() => {
        setLoading(true);
        await axios.get(`/api/users/get`, {headers : {
          authorization : 'Bearer ' + localStorage.getItem('token')
        }}).then(res => {
          if(res.status === 200) {
            setUsers(res.data);
            console.log(res.data);
            setLoading(false);
          } else {
            message.error({
              content: res.data.errorMessage,
              style: {
                marginTop: '20vh',
              },
            });
          }
        })
    }

    const getUserById = async(userId) => {
        setLoading(true);
        await axios.get(`/api/users/get/${userId}`, {headers : {
          authorization : 'Bearer ' + localStorage.getItem('token')
        }}).then(res => {
          if(res.status === 200) {
            setUser(res.data);
            setProductId(res.data._id)
            setImage(res.data.image)
            setLoading(false);
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

    const deleteHandler = async(userId) => {
        setLoading(true);
        await axios.delete(`/api/users/delete/${userId}`, {headers : {
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
            getUsers();
          } else {
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
        await axios.post(`/api/users/edit/${ProductId}`, data, {headers : {
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
            getUsers();
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
      await axios.post(`/api/users/admin/change/password/${user._id}`, {newPassword: password.newPassword, confirmNewPassword: password.confirmNewPassword} , {headers : {
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
            getUsers();
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
        <div>
          <div>
          <span className = 'float-right my-2'>
              <CreateUsers />
            </span>
          <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Picture</th>
                <th scope="col">Full Name</th>
                <th scope="col">Username</th>
                <th scope="col">E-mail</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                     users.map((user, index) => {
                         return(
                            <tr>
                            <th className = 'pt-4' scope="row">{index + 1}</th>
                            <td><img width = '60' height = '64'  src = {user.image} alt = {user.firsName}/></td>
                            <td className = 'pt-4'>{user.fullName}</td>
                            <td className = 'pt-4'>{user.username}</td>
                            <td className = 'pt-4'>{user.email}</td>
                            <td className = 'pt-4'><span className = 'border p-2'>{user.role}</span></td>
                            <td className = 'pt-4'>
                              <a onClick = {() => {getUserById(user._id); showDrawer()}}><EyeOutlined /></a>
                              <a className = 'ml-3' onClick = {() => {getUserById(user._id); showEditDrawer(); setSuccess(true);}}><EditOutlined /></a>
                              <a className = 'ml-3' onClick = {() => {deleteHandler(user._id);setSuccess(true);}}><DeleteOutlined /></a>
                               
                            </td>
                            </tr>
                         )
                     })
                }
                
            </tbody>
            </table>


{/******************************************* Drawer for User Information *******************************/}

        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <p className="site-description-item-profile-p" style={{ marginTop: '80px', fontWeight: 'bold' }}>
            User Profile
          </p>
          <Row>
            <Col span={12} className = 'text-center'>
               <img width = '200' src = {user.image} alt = {user.fullName}/>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Full Name" content={<span>{user.fullName}</span>} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="E-mail" content={user.email} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Username" content={user.username} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Role" content={user.role} />
            </Col>
          </Row>
        </Drawer>


{/******************************************* Drawer for Editing User Information *******************************/}
        {
          loading ?
          <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
          <Spin indicator={antIcon} />
          </div>

          :

        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={onEditClose}
          visible={editVisible}
        >
            <Form className = 'editUserForm'>
            <Row>
            <Col span={24} style = {{paddingLeft: '23px', marginTop: '100px', marginBottom : '32px'}}>
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
            <Col span={12} style = {{paddingLeft: '23px'}}>
             <h6>First Name:</h6>
            <Input style = {{marginBottom: '32px'}} name = 'fullName' onChange= {handleEditUserChange} value={user.fullName}/>
            </Col>
            <Col span={12} style = {{paddingLeft: '23px'}}>
            <h6>Email:</h6>
            <Input style = {{marginBottom: '32px'}} name = 'email' onChange= {handleEditUserChange} value={user.email}/>
            </Col>
            <Col span={12} style = {{paddingLeft: '23px'}}>
            <h6>Role:</h6>
            <Input style = {{marginBottom: '32px'}} name = 'role' onChange= {handleEditUserChange} value={user.role}/>
            </Col>
            <Col span={12} style = {{paddingLeft: '23px'}}>
            <h6>Username:</h6>
            <Input style = {{marginBottom: '32px'}} name = 'username' onChange= {handleEditUserChange} value={user.username}/>
            </Col>
            <Col className = 'text-center' span={24} style = {{paddingLeft: '23px', marginTop: '32px'}}>
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
            

       </Drawer>
       }
          </div>
            
        </div>
    )
}
