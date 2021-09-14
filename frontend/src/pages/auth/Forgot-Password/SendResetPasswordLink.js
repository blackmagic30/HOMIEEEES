import { Button, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'

export const SendResetPasswordLink = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const submitHandler = async(e) => {
        setLoading(true);
        e.preventDefault();
             await axios.post(`/api/users/reset-password`, {email}).then(res => {
                 if(res.status === 200) {
                    message.success({
                        content : res.data.successMessage,
                        style: {
                            marginTop: '15vh',
                          },
                    });
                    setLoading(false);
                 }
                  else {
                      setLoading(false);
                    message.error({
                        content : res.data.errorMessage,
                        style: {
                            marginTop: '15vh',
                          },
                    });
                  }
             })
        
    }
    return (
        <div className = 'd-flex justify-content-center' style = {{height: '100vh'}}>
        <div className = 'form-inner text-center w-50' style = {{paddingTop: '15vh'}}>
        <h4>Enter Your Email</h4>
        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}} className = 'w-100'>
         <form className = 'w-100'>
              <div className="floating-label-group my-2">
                 <input placeholder = 'Enter your email' onChange = {handleChange} name = 'email' type="text" id="email" className="form-control" autofocus required />
                </div>
          <Button loading = {loading} onClick = {submitHandler} className = 'btn my-2 mt-2 w-50' style = {{height: '41px'}}>
             Send E-mail
          </Button>
      </form>
      </div>
      </div>
    </div>
    )
}
