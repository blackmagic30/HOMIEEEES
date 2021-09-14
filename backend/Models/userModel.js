const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: '0'
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        require: true
    },
    cloudinary_id: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    }, 
     resetToken: {
        type: String
    },
    expireToken: {
        type: String
    },
    verification: {
        type: Boolean,
        default: false
    }
  
}, {timestamps: true}
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
