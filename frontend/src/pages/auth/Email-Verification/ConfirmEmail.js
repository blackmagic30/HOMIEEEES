import { Button, message } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'
import { logout } from '../../../components/auth/auth';

export const ConfirmEmail = (props) => {
  const [loading, setLoading] = useState(false);
    const handleVerification = async () => {
         setLoading(true)
         await axios.post('/api/users/confirm/email', {token: props.match.params.token}).then(res => {
              if(res.status === 200) {
                setLoading(false);
                message.success({
                    content: res.data.successMessage,
                    style: {
                      marginTop: '20vh',
                    },
                  });
                  setTimeout(() => {
                    logout(() => { });
                    window.location.reload();
                  }, 2000);
              }
              else {
                setLoading(false);
                message.error({
                    content: res.data.errorMessage,
                    style: {
                      marginTop: '20vh',
                    },
                  });
              }
         })
    }
    return (
        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh'}}>
               <h6>
                   Kindly click on the button to confirm your email
                   <br/>
                   <div className = 'text-center'>
                   <Button type = 'primary' loading = {loading} style = {{ marginTop: '23px'}} onClick = {handleVerification}>Verify Now</Button>
                   </div>               
               </h6>
        </div>
    )
}
