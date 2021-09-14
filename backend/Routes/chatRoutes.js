const express = require('express');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const upload = require('../middlewares/multer');
const { getChat, indChat, uploadImage, chatByGroups } = require('../controllers/chatController');
const router = express.Router();


router.get('/getChats', AuthenticatorJWT, getChat);
router.post('/ind-chat', AuthenticatorJWT, indChat);
router.post('/group-chat', AuthenticatorJWT, chatByGroups);
router.post('/upload-image', upload.single('file'), AuthenticatorJWT, uploadImage);

module.exports = router; 