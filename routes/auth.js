const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const authorityMiddleware = require('../middleware/authority_middleware');

/* #swagger.tags = ['Authentication'] */
/* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
        $email: 'user@example.com',
        $password: 'StrongP@ssw0rd123!',
        authority: 0,
        car_plate: 'AB123CD'
    }
}
#swagger.responses[201] = {
    description: 'User created successfully',
    schema: {
        message: 'Utente registrato correttamente',
        user: {
            id: 1,
            email: 'user@example.com',
            authority: 0,
            car_plate: 'AB123CD'
        }
    }
}
#swagger.responses[400] = {
    description: 'Bad request - email already exists or validation failed',
    schema: {
        message: "L'utente esiste già"
    }
} */
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh', authController.refreshUser);
router.get('/checkSession', authorityMiddleware.requireAnyUser, authController.checkSession)

router.post('/device/register', authorityMiddleware.requireAdmin, authController.registerDevice)
router.post('/device/login', authController.loginDevice)
router.post('/device/refresh', authController.refreshDevice);


module.exports = router;
