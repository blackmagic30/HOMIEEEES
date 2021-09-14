import { Button, message } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { isAuthenticated } from '../../../components/auth/auth'

export const SendVerficationEmail = () => {
  const [loading, setLoading] = useState(false);
    const handleVerification = async () => {
          setLoading(true)
         await axios.post('/api/users/send/confirm-mail', {email: isAuthenticated().email}).then(res => {
              if(res.status === 200) {
                setLoading(false);
                message.success({
                    content: res.data.successMessage,
                    style: {
                      marginTop: '20vh',
                    },
                  });
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
        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: '20vh'}}>
               <h6>
                   Kindly Verify your email to use Timble
                   <br/>
                   <div className = 'text-center'>
                   <Button type = 'primary' loading = {loading} style = {{ marginTop: '23px'}} onClick = {handleVerification}>Send E-mail</Button>
                   </div>
               </h6>
        </div>
    )
}
