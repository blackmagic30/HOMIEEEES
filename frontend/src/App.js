import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Chat } from './pages/chat/Chat';
import { ChatBody } from './pages/chat/ChatBody';
import './index.css'
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Navbar } from './components/nav/Navbar';
import { GroupChatBody } from './pages/chat/groupChatBody';
import AdminRoute from './routes/AdminRoute';
import { Users } from './pages/admin/Users/Users';
import { Profile } from './pages/profile/Profile';
import { SendVerficationEmail } from './pages/auth/Email-Verification/SendVerficationEmail';
import { ConfirmEmail } from './pages/auth/Email-Verification/ConfirmEmail';
import { SendResetPasswordLink } from './pages/auth/Forgot-Password/SendResetPasswordLink';
import { UpdatePassword } from './pages/auth/Forgot-Password/UpdatePassword';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
            <Navbar />
            <div style = {{marginTop: '100px'}}>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path = '/verify-email' component = {SendVerficationEmail}/>
           <Route exact path = '/confirm-email/:token' component = {ConfirmEmail}/>
           <Route exact path = '/reset-password' component = {SendResetPasswordLink}/>
           <Route exact path = '/update/:token' component = {UpdatePassword}/>
            <Route exact path='/' component={Chat} />
            <Route exact path='/chat/:id' component={ChatBody} />
            <Route exact path='/group/:id' component={GroupChatBody} />
            <AdminRoute exact path = '/admin/users' component = {Users}/>
            <Route exact path = '/profile/:id' component = {Profile}/>
          </Switch>
        </div>
        </div>
      </BrowserRouter>
    </div>

  )
}

export default App;