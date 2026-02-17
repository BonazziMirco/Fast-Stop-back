const jwt = require('jsonwebtoken');
const User = require('../models/user');
const env = require('../config/env');
const logger = require('../config/logger');
const Device = require("../models/device");

class AuthController {
  /**
   * Register a new user
   */
  async registerUser(req, res, next) {
    const { email, password, authority = 0, car_plate } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "L'utente esiste già" });
      }

      const user = await User.create({
        email,
        password, // Will be hashed by model hook
        authority,
        car_plate
      });

      return res.status(201).json({
        message: 'Utente registrato correttamente',
        user: {
          id: user.id,
          email: user.email,
          authority: user.authority,
          car_plate: user.car_plate
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Credenziali invalide' });
      }

      const isValidPassword = await user.checkPassword(password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Credenziali invalide' });
      }

      if(!user.is_active) {
        return res.status(403).json({ message: 'Account disabilitato. Contatta l\'amministratore.' });
      }

      // Generate tokens
      const token = jwt.sign(
          { id: user.id, type: 'user', authority: user.authority },
          env.USER_JWT_SECRET,
          { expiresIn: env.USER_JWT_EXPIRES_IN || '1h' }
      );

      const refreshToken = jwt.sign(
          { id: user.id },
          env.USER_JWT_REFRESH_SECRET,
          { expiresIn: env.USER_JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // log only sensitive logins for security purposes
      if(user.authority>=2) {
        logger.info('User logged in successfully', {
          userId: user.id,
          email: user.email,
          authority: user.authority
        });
      }

      return res
          .status(200)
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
            maxAge: parseInt(env.USER_JWT_REFRESH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000
          })
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
            maxAge: parseInt(env.USER_JWT_REFRESH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000
          })
          .json({
            message: 'Login effettuato con successo',
            user: {
              id: user.id,
              email: user.email,
              authority: user.authority
            },
            token // Also sent token in body if needed for mobile apps
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token
   */
  async refreshUser(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Token mancante' });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, env.USER_JWT_REFRESH_SECRET);

      // Find user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Utente non trovato' });
      }

      // Generate new tokens
      const newToken = jwt.sign(
          { id: user.id, type: 'user', authority: user.authority },
          env.USER_JWT_SECRET,
          { expiresIn: env.USER_JWT_EXPIRES_IN || '1h' }
      );

      const newRefreshToken = jwt.sign(
          { id: user.id },
          env.USER_JWT_REFRESH_SECRET,
          { expiresIn: env.USER_JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      return res
          .status(200)
          .cookie('token', newToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production'
          })
          .cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production'
          })
          .json({
            message: 'Token aggiornato',
            user: {
              id: user.id,
              email: user.email,
              authority: user.authority
            }
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  async logoutUser(req, res, next) {
    try {
      // Clear cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      return res.status(200).json({ message: 'Logout effettuato con successo' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login IOT device
   * @param req
   * @param res
   * @param next
   * @returns {Promise<*>}
   */

  async loginDevice(req, res, next) {
    const { name, api_key } = req.body;

    try {
      const device = await Device.findOne({ where: { name } });
      if (!device) {
        return res.status(400).json({ message: 'Device not found' });
      }

      const isValidKey = await device.checkApiKey(api_key);
      if (!isValidKey) {
        return res.status(400).json({ message: 'Invalid Key' });
      }

      // Generate tokens
      const token = jwt.sign(
          { id: device.id, type: 'device', authority: device.authority },
          env.DEVICE_JWT_SECRET,
          { expiresIn: env.DEVICE_JWT_EXPIRES_IN || '30d' }
      );

      const refreshToken = jwt.sign(
          { id: device.id },
          env.DEVICE_JWT_REFRESH_SECRET,
          { expiresIn: env.DEVICE_JWT_REFRESH_EXPIRES_IN || '365d' }
      );

      logger.info('Device logged in successfully', {
        userId: device.id,
        name: device.name,
        authority: device.authority
      });

      return res
          .status(200)
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
            maxAge: parseInt(env.DEVICE_JWT_REFRESH_COOKIE_MAX_AGE) || 365 * 24 * 60 * 60 * 1000
          })
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production',
            maxAge: parseInt(env.DEVICE_JWT_REFRESH_COOKIE_MAX_AGE) || 365 * 24 * 60 * 60 * 1000
          })
          .json({
            message: 'Login successfull',
            device: {
              id: device.id,
              name: device.name,
              authority: device.authority
            },
            token
          });
    } catch (error) {
      next(error)
    }
  }

  /**
   * Refresh IOT device token
   * @param req
   * @param res
   * @param next
   * @returns {Promise<*>}
   */
  async refreshDevice(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Token mancante' });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, env.DEVICE_JWT_REFRESH_SECRET);

      // Find device
      const device = await Device.findByPk(decoded.id);
      if (!device) {
        return res.status(401).json({ message: 'Utente non trovato' });
      }

      // Generate new tokens
      const newToken = jwt.sign(
          { id: device.id, type: 'device', authority: device.authority },
          env.DEVICE_JWT_SECRET,
          { expiresIn: env.DEVICE_JWT_EXPIRES_IN || '1h' }
      );

      const newRefreshToken = jwt.sign(
          { id: device.id },
          env.DEVICE_JWT_REFRESH_SECRET,
          { expiresIn: env.DEVICE_JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      return res
          .status(200)
          .cookie('token', newToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production'
          })
          .cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: env.NODE_ENV === 'production'
          })
          .json({
            message: 'Token aggiornato',
            device: {
              id: device.id,
              name: device.name,
              authority: device.authority
            }
          });
    } catch (error) {
      next(error);
    }
  }


  async registerDevice(req, res, next) {
    const { name, parking_lot_id, authority = 0 } = req.body;

    try {
      const existingDevice = await User.findOne({ where: { name } });
      if (existingDevice) {
        return res.status(400).json({ message: "Device already exists" });
      }

      const apiKey = crypto.randomBytes(32).toString('hex');

      const device = await Device.create({
        name,
        parking_lot_id,
        authority,
        apiKey
      });

      logger.info('New device created: ', {
        name: device.name,
        parking_lot_id: parking_lot_id,
        authority: authority
      });

      return res.status(201).json({
        message: 'Device registered successfully',
        device: {
          id: device.id,
          name: device.name,
          authority: device.authority
        }
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AuthController();