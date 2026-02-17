const express = require('express');
const router = express.Router();
const ParkingController = require('../controllers/parking_controller');
const authorityMiddleware = require('../middleware/authority_middleware');

router.get('/zones/:zoneId/lots', ParkingController.getParkingLotsByZone);
router.post('/lots', authorityMiddleware.requireOperator, ParkingController.addParkingLot);
router.patch('/lots/:id/capacity', authorityMiddleware.requireOperator, ParkingController.updateParkingCapacity);
router.delete('/lots/:id', authorityMiddleware.requireOperator, ParkingController.deleteParkingLot);
router.patch('/lots/:id/occupy', authorityMiddleware.requireParkometer, ParkingController.occupySpot);
router.patch('/lots/:id/free', authorityMiddleware.requireAnyUser, ParkingController.freeSpot);


module.exports = router;
