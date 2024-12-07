const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

router.get('/', auth.testConnection);
router.post('/signup', auth.signUp);
router.post('/signin', auth.signIn);
router.get('/users', auth.getAllusers);
router.get('/users/:id', auth.getUsersById);
router.put('/users/:id', auth.updateUsersById);
router.delete('/users/:id', auth.deleteUsersById);

module.exports = router;