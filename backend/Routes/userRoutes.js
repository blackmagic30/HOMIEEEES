const express = require('express');
const upload = require('../middlewares/multer');
const { signUp, login, getAllUsers, getUserById, updateUserProfile, changeUserPassword, changeUserPasswordByAdmin, deleteUser, resetPasswordLink, updatePassword, sendConfirmationEmail, confirmEmail } = require('../controllers/userController');
const { AuthenticatorJWT, isAdmin } = require('../middlewares/authenticator');

const router = express.Router();

router.post('/signup', upload.single('file'), signUp);
router.post('/login', login);
router.get('/get', AuthenticatorJWT, getAllUsers);
router.get('/get/:id', getUserById);
router.post('/edit/:id', AuthenticatorJWT, upload.single('file') , updateUserProfile);
router.post('/admin/change/password/:id', AuthenticatorJWT, changeUserPasswordByAdmin);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteUser);
router.post('/reset-password', resetPasswordLink);
router.post('/update-password', updatePassword);
router.post('/send/confirm-mail', upload.any(''), sendConfirmationEmail);
router.post('/confirm/email', upload.any(''), confirmEmail);

module.exports = router;