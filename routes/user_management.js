const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const authController = require('../controllers/auth_controller');
const authorityMiddleware = require('../middleware/authority_middleware');

router.get('/users', profileController.getAllUsers);
router.delete('/users/:id', authController.deleteUser);
router.patch('/users/:id/role', authController.updateUserRole);
router.patch('/users/:id/activate', authController.activateUser);



module.exports = router;
