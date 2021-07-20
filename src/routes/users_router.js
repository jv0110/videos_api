const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users_controller');

router.get('/users', UsersController.get_users);
router.get('/user/:user_id', UsersController.get_user);
router.post('/register', UsersController.post_user);
router.post('/login', UsersController.login);

module.exports = router;