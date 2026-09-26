const express = require('express');

const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/me', authMiddleware, AuthController.me);
router.patch('/password', authMiddleware, AuthController.changePassword);

module.exports = router;
