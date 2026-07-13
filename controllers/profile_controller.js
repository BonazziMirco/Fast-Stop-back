const User = require('../models/user');
const Device = require("../models/device");

class ProfileController {

    async getProfile(req, res, next) {
        try {
            const user = await User.findByPk(req.auth.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({
                id: user.id,
                email: user.email,
                car_plate: user.car_plate,
                authority: user.authority,
                is_active: user.is_active,
                created_at: user.created_at
            });
        } catch (error) {
            next(error);
        }
    }

    async changeCarPlate(req, res, next) {
        try {
            const { password, car_plate } = req.body;
            const user = await User.findByPk(req.auth.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if(!await user.checkPassword(password)) {
                return res.status(400).json({ message: 'Password is incorrect' });
            }
            user.car_plate = car_plate;
            await user.save();
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const user = await User.findByPk(req.auth.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if(!await user.checkPassword(oldPassword)) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
            user.password = newPassword; // Will be hashed by hook
            await user.save();
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'email', 'car_plate', 'authority', 'is_active', 'created_at']
            });
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async getAllDevices(req, res, next) {
        try{
            const devices = await Device.findAll({
                attributes: ['id', 'name', 'parking_lot_id', 'authority', 'last_heartbeat']
            })
            res.json(devices);
        } catch (error) {
            next(error);
        }
    }

    async updateLastHeartbeat(req, res, next) {
        try {
            const device = await Device.findByPk(req.auth.id);
            if (!device) {
                return res.status(404).json({message: 'Device not found'});
            }
            device.last_heartbeat = Date.now() / 1000;
            await device.save();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProfileController();