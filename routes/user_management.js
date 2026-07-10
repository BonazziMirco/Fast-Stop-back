const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const authController = require('../controllers/auth_controller');

router.get('/users', profileController.getAllUsers);
router.delete('/users/:id', authController.deleteUser);
router.patch('/users/:id', authController.toggleUserStatus);

router.get('/devices', profileController.getAllDevices);
router.delete('/devices/:id', authController.deleteDevice);



module.exports = router;
