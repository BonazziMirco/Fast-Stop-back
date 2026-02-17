const Parkometer = require('../models/parkometer');

class ParkometerController {

    async getParkometers(req, res, next) {
        try {
            const parkometers = await Parkometer.findAll();
            res.status(200).json(parkometers);
        } catch (error) {
            next(error);
        }
    }

    async updateHeartBeat(req, res, next) {
        const { id } = req.params;
        try {
            await Parkometer.updateHeartBeat(id);
            res.status(200).json({ message: 'Heart beat updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async addParkometer(req, res, next) {
        const {parking_lot_id} = req.body;
        try {
            const newParkometer = await Parkometer.create({parking_lot_id});
            return res.status(201).json({
                message: 'Parkometer added successfully',
                data: newParkometer
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteParkometer(req, res, next){
        const {id} = req.params;
        try {
            const parkometer = await Parkometer.findByPk(id);
            if (!parkometer) {
                return res.status(404).json({error: 'Parkometer not found'});
            }
            await parkometer.destroy();
            return res.status(200).json({message: 'Parkometer removed successfully'});
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new ParkometerController();