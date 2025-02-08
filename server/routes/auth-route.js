const express = require('express');
const router = express.Router();

const authController = require('../controller/auth-controller');

router.post('/login', authController.Login);
router.get('/sign-up', authController.SignUp);

module.exports = router;
