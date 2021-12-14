require('dotenv').config();

const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth')

const userController = require('../controllers/user')

router.get('/', userController.index)
router.get('/exists/:name', verifyToken, userController.find)
router.post('/register', userController.register)
router.post('/login', userController.login)

module.exports = router;