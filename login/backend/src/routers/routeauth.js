const express = require('express');
const router = express.Router();
const auth = require('../controlleers/auth');

router.post('/signup', auth.signup);
router.post('/signin', auth.signin);
router.post('/signout', auth.signout);
router.get('/getallusers', auth.getAllusers);
router.get('/getusersbyid/:id', auth.getUsersById);
router.delete('/deleteusersbyid/:id', auth.deleteUsersById);
router.put('/editusersbyid/:id', auth.editUsersById);

module.exports = router;