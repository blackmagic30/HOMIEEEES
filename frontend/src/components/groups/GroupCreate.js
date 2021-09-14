import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, message, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../auth/auth'
import { Select } from 'antd';

const { Option } = Select;

export const GroupCreate = (props) => {
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
    
      const submitHandler = async () => {
        console.log('create')
        await axios.post('/api/groups/create', { group: groupName, selectedMembers }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
          if (res.status === 200) {
            successMessage(res.data.successMessage);
            setSuccess(true);
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
                <Button onClick={showModal}><PlusOutlined /></Button>
            </div>
            <Modal title="Create group" footer={false} visible={isModalVisible} onCancel={handleCancel}>
                <Input className='w-75' onChange={(e) => setGroupName(e.target.value)} />
                <div className='my-4'>
                    <Select
                        mode="multiple"
                        style={{ width: '75%' }}
                        placeholder="Choose Users..."
                        onChange={handleChange}
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
                <Button onClick={submitHandler}>Create</Button>
            </Modal>
        </div>
    )
}
