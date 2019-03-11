const express = require('express');
const controller = require('../controllers/user');
const passport = require('passport');
const router = express.Router();

// localhost:5000/api/users/login
router.post('/login', controller.login);

// localhost:5000/api/users/login
router.get('/login', controller.getLoginPage);

// localhost:5000/api/users
router.post('/', controller.register);

// localhost:5000/api/users
router.get('/', controller.getRegisterPage);

// localhost:5000/api/users/:id
router.get('/:id', controller.getById);


module.exports = router;