const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const authorityMiddleware = require('../middleware/authority_middleware');

router.get('/', authorityMiddleware.requireAnyUser, profileController.getProfile);
router.patch('/password', authorityMiddleware.requireAnyUser, profileController.updatePassword);
router.patch('/car-plate', authorityMiddleware.requireAnyUser, profileController.updateCarPlate);


module.exports = router;
