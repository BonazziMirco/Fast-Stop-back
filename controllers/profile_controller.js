const User = require('../models/user');

class ProfileController {

    async getProfile(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
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
            const { car_plate } = req.body;
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
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
            const { newPassword } = req.body;
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.password = newPassword; // Will be hashed by hook
            await user.save();
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            next(error);
        }
    }

    async changeActiveStatus(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.is_active = !user.is_active;
            await user.save();
            res.status(200).json({ message: 'Account status changed successfully' });
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
}

module.exports = new ProfileController();