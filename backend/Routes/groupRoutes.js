const express = require('express');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const { getAllGroups, createGroup, deleteGroup, getGroupById, updateGroup } = require('../controllers/groupController');

const router = express.Router();

router.get('/get', AuthenticatorJWT, getAllGroups);
router.get('/get/:id', AuthenticatorJWT, getGroupById);
router.post('/update/:id', AuthenticatorJWT, updateGroup);
router.post('/create', AuthenticatorJWT, createGroup);
router.delete('/delete/:id', AuthenticatorJWT, deleteGroup);

module.exports = router;