const express = require('express');
const router = express.Router();
const parkometerController = require('../controllers/parkometer_controller');
const authorityMiddleware = require('../middleware/authority_middleware');


router.patch( '/:id', authorityMiddleware.requireParkometer, parkometerController.updateHeartBeat);

router.post('/', authorityMiddleware.requireOperator, parkometerController.addParkometer);

router.delete('/:id', authorityMiddleware.requireOperator, parkometerController.deleteParkometer);



module.exports = router;
