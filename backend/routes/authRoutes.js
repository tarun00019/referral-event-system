const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController');
const validate = require('../app/middlewares/validationMiddleware');

router.post(
    '/register',
    validate(['name', 'email', 'password']),
    AuthController.register
);

router.post(
    '/login',
    validate(['email', 'password']),
    AuthController.login
);

module.exports = router;