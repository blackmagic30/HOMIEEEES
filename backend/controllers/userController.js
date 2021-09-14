const User = require('../Models/userModel');
var fs = require('fs');
var bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/keys');
const jwt = require('jsonwebtoken');
const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinaryConfig');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


exports.getAllUsers = async(req, res) => {
   const users = await User.find();
   if(users) {
        res.status(200).json(users);
   }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
} 

exports.getUserById = async(req, res) => {
   const user = await User.findOne({_id: req.params.id});
   if(user) {
        res.status(200).json(user);
   }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
} 

exports.signUp = async (req, res) => {
    const ifEmailAlreadyPresent = await User.findOne({ email: req.body.email });
    const ifUsernameAlreadyPresent = await User.findOne({ username: req.body.username });
    if (ifEmailAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Email already exists. Please try another one.' });
    }
    else if (ifUsernameAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Username already exists. Please try another one.' });
    }
    else {
        const { path } = req.file;
        const uploading = await cloudinary.uploads(path, 'Zarc-Chat-App/User');
        image = uploading.url;
        cloudinary_id = uploading.id
        fs.unlinkSync(path);

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            username: req.body.username,
            image: image,
            cloudinary_id,
            password: hash
        });

        const saveUser = await user.save();
        if (saveUser) {
            res.status(200).json({ successMessage: 'Account created successfuly!. Please Sign in.' });
        } else {
            res.status(400).json({ errorMessage: 'Account not created. Please try again' });
        }
    }
}


exports.login = async (req, res) => {
    const findUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.email }]
    });

    if (findUser) {
        const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
        if (checkPassword) {
            const payload = {
                user: {
                    _id: findUser._id,
                    role: findUser.role
                }
            }
            jwt.sign(payload, jwtSecret, (err, token) => {
                if (err) res.status(400).json({ errorMessage: 'Jwt Error' })

                const { _id, fullName, role, username, email, image, cloudinary_id, verification } = findUser;
                res.status(200).json({
                    _id,
                    role,
                    fullName,
                    username,
                    email,
                    image,
                    cloudinary_id,
                    token,
                    verification,
                    successMessage: 'Logged In Successfully',

                });
            });
        } else {
            res.status(201).json({ errorMessage: 'Incorrect username or password.' })
        }

    } else {
        res.status(201).json({ errorMessage: 'Incorrect username or password.' })
    }
}



exports.updateUserProfile = async(req, res) => {
    const findUser = await User.findOne({_id : req.params.id});   
    if(findUser) {
        if(req.file) {
            const imgUrl = findUser.cloudinary_id;
            await cloudinaryCon.uploader.destroy(imgUrl);
            const { path } = req.file;
            const uploading =  await cloudinary.uploads(path, 'UserImages');
            imageUpload = uploading.url;
            cloudinary_id = uploading.id
            fs.unlinkSync(path);
            findUser.fullName = req.body.fullName,
            findUser.email = req.body.email,
            findUser.username = req.body.username,
            findUser.image = imageUpload,
            findUser.cloudinary_id = cloudinary_id
    
            const saveUser = await findUser.save();
            if(saveUser) {
                res.status(200).json({successMessage: 'User Updated Successfully'})
            } else (
                res.status(400).json({errorMessage: 'User could not be Updated.'})
            )
        } 
        else if(req.body.image) {
             findUser.fullName = req.body.fullName,
             findUser.email = req.body.email,
             findUser.username = req.body.username
                  
             const saveUser = await findUser.save();
             if(saveUser) {
                 res.status(200).json({successMessage: 'User Updated Successfully'})
             } else (
                 res.status(400).json({errorMessage: 'User could not be Updated.'})
             )
        }
    } else {
        res.status(404).json({errorMessage: 'User not found.'})
    }
}


exports.changeUserPassword =  async(req, res) => {
      console.log(req.body.oldPassword, req.body.newPassword);
      if(req.body.newPassword !== req.body.confirmNewPassword){
           res.status(400).json({errorMessage: 'Passwords do not match.'})
       }  

       else {
                const findUser = await User.findById({_id: req.user._id});
                if(findUser) {
                    const checkPassword =  bcrypt.compareSync(req.body.oldPassword, findUser.password);
                    if(checkPassword) {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(req.body.newPassword, salt);
                        findUser.password = hash;
                        findUser.save((error, result) => {
                            if(error) {
                                res.status(400).json({errorMessage: 'Failed to change password'});
                            } else {
                                res.status(200).json({successMessage: 'Password changed Successfully.'})
                            }
                        })
                    }  else {
                        res.status(201).json({errorMessage: 'Please enter correct old password.'})
                    }
                  
                }
       }
}


exports.changeUserPasswordByAdmin = async(req, res) => {
    if(req.body.newPassword !== req.body.confirmNewPassword){
         res.status(400).json({errorMessage: 'Passwords do not match.'})
     }  

     else {
              const findUser = await User.findById({_id: req.params.id});
              if(findUser) {
                      var salt = bcrypt.genSaltSync(10);
                      var hash = bcrypt.hashSync(req.body.newPassword, salt);
                      findUser.password = hash;
                      findUser.save((error, result) => {
                          if(error) {
                              res.status(400).json({errorMessage: 'Failed to change password'});
                          } else {
                              res.status(200).json({successMessage: 'Password changed Successfully.'})
                          }
                      })                
              }
     }
}

exports.deleteUser =  async(req, res) => {
    const findUser = await User.findOne({_id: req.params.id});
    if (findUser) {
       const del = findUser.remove();
       if(del){
        res.status(200).json({successMessage: 'User Deleted Successfully'});
      } 
        else {
          res.status(400).json({errorMessage: 'User could not be deleted. Please Try Again'});
        } 
        

    }  else {
        res.status(404).json({errorMessage: 'User Not Found.'})
    }

}





/**********************************************  Forgot Password  ***********************************************/
exports.resetPasswordLink = async(req, res) => {
    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(error);
        } 
        const token = buffer.toString("hex");
       User.findOne({email: req.body.email}).then(user => {
           if(!user) {
               res.status(201).json({errorMessage: 'Email does not exist'});
           } 
           user.resetToken = token;
           user.expireToken = Date.now() + 3600000;
           user.save((err, result) => {
               if(err) {
                   res.status(400).json({errorMessage: 'Token saving failed'});
               }
                if(result) {
                            let url = '';
                            if(process.env.NODE_ENV === 'production') {
                                url = `http://timble.com/update/${token}` // The url of the domain on which we are hosting our frontend in production mode to serve the reset-password link page by sending this link to the email
                            } else {
                              url =  `http://localhost:3000/update/${token}`  // The url of the frontend in developement mode to serve the reset-password link page on the frontend by sending this link to the email
                            }
                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                  user: 'timblestaff@gmail.com', //put your gmail account here
                                  pass: 'P@$$word', //put your account password here
                                },
                              });
                               transporter.sendMail({
                                from: 'timblestaff@gmail.com', //put your gmail account here
                                to: req.body.email,
                                subject: "Email Verification Link",
                                html: `<p>Click this <a href = ${url}>${url}</a> to verify your email.</p>`,
                              }).then(data => {
                                    res.status(200).json({successMessage: 'Check your Inbox!', data});
                            })
                }
           })

       })
    })
   
   
}

exports.updatePassword = async(req, res) => { 
    if(req.body.password !== req.body.confirm){
         res.status(400).json({errorMessage: 'Passwords do not match.'})
     }  

     else {
              await User.findOne({resetToken: req.body.token, expireToken: {$gt: Date.now()}}).then(user => {
              if(!user) {
                  res.status(201).json({errorMessage: 'Try again. Session expired!'});
              }    
              if(user) {
                      var salt = bcrypt.genSaltSync(10);
                      var hash = bcrypt.hashSync(req.body.password, salt);
                      user.password = hash;
                      user.resetToken = '',
                      user.expireToken = '',
                      user.save((error, result) => {
                          if(error) {
                              res.status(400).json({errorMessage: 'Failed to update password'});
                          } else {
                              res.status(200).json({successMessage: 'Password updated Successfully.'})
                          }
                      })                
              }
            });
     }
}




/***************************************************************** Email Verification ***********************************************************/
exports.sendConfirmationEmail = async(req, res) => {
    console.log(req.body.email);
    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(error);
        } 
        const token = buffer.toString("hex");
       User.findOne({email: req.body.email}).then(user => {
           if(!user) {
               res.status(201).json({errorMessage: 'Email does not exist'});
           } 
           user.resetToken = token;
           user.save((err, result) => {
               if(err) {
                   res.status(400).json({errorMessage: 'Token saving failed'});
               }
                if(result) {
                             let url = '';
                            if(process.env.NODE_ENV === 'production') {                 //ensure less secure apps in chome is turned off
                                url = `https://gistoscope.com/confirm-email/${token}` // The url of the domain on which we are hosting our frontend in production mode to serve the reset-password link page by sending this link to the email
                            } else {
                              url =  `http://localhost:3000/confirm-email/${token}`  // The url of the frontend in developement mode to serve the reset-password link page on the frontend by sending this link to the email
                            }
                      let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'timblestaff@gmail.com', //put your gmail account here
                          pass: 'P@$$word', //put your account password here
                        },
                      });
                       transporter.sendMail({
                        from: 'timblestaff@gmail.com', //put your gmail account here
                        to: req.body.email,
                        subject: "Email Verification Link",
                        html: `<p>Click this <a href = ${url}>${url}</a> to verify your email.</p>`,
                      }).then(data => {
                            res.status(200).json({successMessage: 'Check your Inbox!', data});
                    })
                    
                }
           })
  
       })
    })
   
   
  }
  
  exports.confirmEmail = async(req, res) => {
      console.log(req.body.token);
       await User.findOne({resetToken: req.body.token}).then(user => {
              if(!user) {
                  res.status(201).json({errorMessage: 'Try again. Session expired!'});
              }    
              if(user) {
                      user.verification = true;
                      user.resetToken = '',
                      user.save((error, result) => {
                          if(error) {
                              res.status(400).json({errorMessage: 'Failed to confirm Email'});
                          } 
                             if(result) {
                                const {_id, firstName, role, lastName, username, email, userPicture, verification} = result;
                                res.status(200).json({
                                    _id,
                                    role,
                                    firstName, 
                                    lastName, 
                                    username, 
                                    email, 
                                    userPicture, 
                                    verification,
                                    successMessage: 'Email Confirmed Successfully. Login again!',
                                });
                          }
                      })                
              }
            });
  }