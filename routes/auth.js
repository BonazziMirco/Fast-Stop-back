const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const authorityMiddleware = require('../middleware/authority_middleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh', authController.refreshUser);
router.get('/checkSession', authorityMiddleware.requireAnyUser, authController.checkSession)

router.post('/device/register', authorityMiddleware.requireAdmin, authController.registerDevice)
router.post('/device/login', authController.loginDevice)
router.post('/device/refresh', authController.refreshDevice);


module.exports = router;
