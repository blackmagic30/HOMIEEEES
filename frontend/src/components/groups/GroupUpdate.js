import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, message, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../auth/auth'
import { Select } from 'antd';
import { Link } from 'react-router-dom'

const { Option } = Select;

export const GroupUpdate = (props) => {
    const user = isAuthenticated();
    const [users, setUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [group, setGroup] = useState({});
    const [success, setSuccess] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const showModal = (id) => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function handleChange(value) {
        setSelectedMembers(value);
    }

    useEffect(() => {
        getAllUsers();
        getGroupById();
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

      const getGroupById = async () => {
        await axios.get(`/api/groups/get/${props.groupId}`, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
          if(res.status === 200) {
            setGroup(res.data);
            setGroupName(res.data.group);
            setSelectedMembers(res.data.members);
          }
          else {
            error(res.data.errorMessage);
          }
        })
      }

      
      const updateHandler = async () => {
        console.log('update')
        await axios.post(`/api/groups/update/${props.groupId}`, { group: groupName, selectedMembers }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
          if (res.status === 200) {
            successMessage(res.data.successMessage);
            props.updateFunction(res.data);
            setIsModalVisible(false);
          }
          else {
            error(res.data.errorMessage);
          }
        })   
      }

    return (
        <div>
            <div className='text-center'>
                <Link onClick={showModal}><EditOutlined /></Link>
            </div>
            <Modal title="Create group" footer={false} visible={isModalVisible} onCancel={handleCancel}>
                <Input className='w-75' value = {groupName} onChange={(e) => setGroupName(e.target.value)} />
                <div className='my-4'>
                    <Select
                        mode="multiple"
                        style={{ width: '75%' }}
                        placeholder="Choose Users..."
                        onChange={handleChange}
                        value={selectedMembers && selectedMembers}
                        optionLabelProp="label"
                    >
                        {
                            users.length > 0 && users.map(members => {
                                return (
                                    <Option value={members._id} label={members.fullName}>
                                        <div className="demo-option-label-item">
                                            <span>
                                                {members.fullName}
                                            </span>
                                        </div>
                                    </Option>
                                )
                            })
                        }
                    </Select>
                </div>
                <Button onClick={updateHandler}>Create</Button>
            </Modal>
        </div>
    )
}
