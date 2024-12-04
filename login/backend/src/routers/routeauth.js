const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

router.get('/', auth.testConnection);
router.post('/signup', auth.signup);
router.post('/signin', auth.signin);
router.post('/signout', auth.signout);
router.get('/users', auth.getAllusers);
router.get('/users/:id', auth.getUsersById);
router.put('/users/:id', auth.editUsersById);
router.delete('/users/:id', auth.deleteUsersById);

module.exports = router;