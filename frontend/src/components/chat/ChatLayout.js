import { DeleteOutlined } from '@ant-design/icons'
import { Comment, message, Avatar, Dropdown, Menu } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/auth'
import { useHistory } from 'react-router'
import { GroupUpdate } from '../groups/GroupUpdate'
import { GroupCreate } from '../groups/GroupCreate'


export const ChatLayout = (props) => {
  const user = isAuthenticated();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [success, setSuccess] = useState(false)
  const history = useHistory();

  useEffect(() => {
    getAllUsers();
    return () => {

    }
  }, []);


  const getAllUsers = async () => {
    await axios.get('/api/users/get', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      const filteringUsers = res.data.filter(filUser => filUser._id !== user._id);
      setUsers(filteringUsers);
    })
  }

  const getAllGroups = async () => {
    await axios.get('/api/groups/get', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        setGroups(res.data);
      }
      else {
        error(res.data.errorMessage);
      }
    })
  }

  const successMessage = (msg) => {
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
        top: '23vh',
        right: '0px'
      },
    });
  };

  const deleteHandler = async (id) => {
    await axios.delete(`/api/groups/delete/${id}`, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        successMessage(res.data.successMessage);
        setSuccess(true);
        history.push('/');
      }
      else {
        error(res.data.errorMessage);
      }
    })
  }

  useEffect(() => {
    getAllGroups();
    return () => {

    }
  }, [success]);

  const updateFunction = (data) => {
    getAllGroups();
  }
  return (
    <div>
      {
        props.usersSide ?
          <>

            <div>

              <div className='row'>
                <div className='col-md-3 col-lg-3 col-sm-3 col-3'>
                  <div style={{ height: '82vh', overflowY: 'auto', position: 'fixed', width: '25%' }}>
                    <div>
                      {
                        users.map(user => {
                          return (
                            <Link to={'/chat/' + user._id}>
                              <Comment style={{ borderTop: '1px solid #eaeaec' }}
                                author={<h6>{user.fullName}</h6>}
                                avatar={
                                  <Avatar
                                    src={user.image}
                                    alt={user.username}
                                  />
                                }
                              />
                            </Link>

                          )
                        })
                      }
                      <div>
                        <hr />
                        <h4 className='text-center border p-2'>Groups</h4>
                        <div>
                          <GroupCreate updateFunction={updateFunction} />
                        </div>
                        <div className='mt-4'>
                          {
                            groups.length > 0 && groups.map(group => {
                              let checkMember = group.members.length > 0 && group.members.map(g => g == isAuthenticated()._id);
                              let checkOwner = group.createdBy === isAuthenticated()._id;
                              return (
                                checkOwner | checkMember[0] === true ?
                                  <Link to={'/group/' + group._id}>
                                    <span className='pb-2 pl-2' style={{ fontSize: '23px', fontWeight: '600' }}>{group.group}</span>
                                    {
                                      checkOwner &&
                                      <Dropdown.Button overlay={<Menu>
                                        <Menu.Item key="1">
                                          <GroupUpdate groupId={group._id} updateFunction={updateFunction} />
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                          <DeleteOutlined onClick={() => deleteHandler(group._id)} />
                                        </Menu.Item>
                                      </Menu>}>

                                      </Dropdown.Button>
                                    }
                                    <hr />
                                  </Link>
                                  :
                                  null
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className='col-md-9 col-lg-9 col-9' style={{ borderCollapse: 'collapse', position: 'relative', height: '100vh'}}>
                  {props.children}
                </div>
              </div>
            </div>
          </>

          :
          props.children
      }

    </div>
  )
}
