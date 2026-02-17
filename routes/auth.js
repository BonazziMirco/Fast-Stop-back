const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh', authController.refreshUser);

router.post('/device/register', authController.registerDevice)
router.post('/device/login', authController.loginDevice)
router.post('/device/refresh', authController.refreshDevice);


module.exports = router;
