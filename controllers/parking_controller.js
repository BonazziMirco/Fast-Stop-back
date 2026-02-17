const parkingModel = require('../models/parking_lot');
const logger = require('../config/logger');

class ParkingController {

    async getParkingLotsByZone(req, res, next) {
        const { zoneId } = req.params;
        try {
            const parkingData = await parkingModel.findAll({where: {zoneId}});
            return res.status(200).json(parkingData);
        } catch (error) {
            next(error);
        }
    }

    async updateParkingCapacity(req, res, next) {
        const { id } = req.params;
        const { newTotalSpots } = req.body;
        try {
            const parking_lot = await parkingModel.findByPk(id);
            if (!parking_lot) {
                return res.status(404).json({ error: 'Parking lot not found' });
            }
            const updatedData = await parking_lot.updateCapacity(newTotalSpots);
            return res.status(200).json({
                message: 'Parking capacity updated successfully',
                data: updatedData
            });
        } catch (error) {
            next(error);
        }
    }

    async addParkingLot(req, res, next) {
        const { id, name, address, zoneId, capacity } = req.body;
        try {
            const newParkingLot = await parkingModel.create({
                id, name, address, zoneId, capacity
            });
            return res.status(201).json({
                message: 'Parking lot added successfully',
                data: newParkingLot
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteParkingLot(req, res, next) {
        const { id } = req.params;
        try {
            await parkingModel.delete(id);
            return res.status(200).json({ message: 'Parking lot deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async occupySpot(req, res, next) {
        const { id } = req.params;
        try {
            const updatedData = await parkingModel.occupySpot(id);
            return res.status(200).json({
                message: 'Spot occupied successfully',
                data: updatedData
            });
        } catch (error) {
            next(error);
        }
    }

    async freeSpot(req, res, next) {
        const { id } = req.params;
        try {
            const updatedData = await parkingModel.freeSpot(id);
            return res.status(200).json({
                message: 'Spot freed successfully',
                data: updatedData
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ParkingController();