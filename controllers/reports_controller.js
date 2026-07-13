const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class ReportsController {

    constructor() {
        // Bind all methods to this instance
        this.buildFilters = this.buildFilters.bind(this);
        this.getDailyStatsByLot = this.getDailyStatsByLot.bind(this);
        this.getWeeklyStatsByLot = this.getWeeklyStatsByLot.bind(this);
        this.getMonthlyStatsByLot = this.getMonthlyStatsByLot.bind(this);
    }

    buildFilters(lotId, startDate, endDate, dateColumn = 'date') {
        const filters = [];
        const replacements = {};

        if (lotId && lotId !== '*') {
            filters.push('parking_lot_id = :lotId');
            replacements.lotId = lotId;
        }

        if (startDate) {
            filters.push(`${dateColumn} >= :startDate`);
            replacements.startDate = startDate;
        }

        if (endDate) {
            filters.push(`${dateColumn} <= :endDate`);
            replacements.endDate = endDate;
        }

        return {
            whereClause: filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '',
            replacements
        };
    }

    async getDailyStatsByLot(req, res, next) {
        try {
            const { lotId, startDate, endDate } = req.query;
            const { whereClause, replacements } = this.buildFilters(lotId, startDate, endDate, 'date');

            const stats = await sequelize.query(
                `
                SELECT date, hour, parking_lot_id, total_reservations, avg_duration_minutes
                FROM stats_daily
                ${whereClause}
                ORDER BY date, hour, parking_lot_id
                `,
                {
                    replacements,
                    type: QueryTypes.SELECT
                }
            );

            return res.status(200).json(stats);
        } catch (err) {
            next(err);
        }
    }

    async getWeeklyStatsByLot(req, res, next) {
        try {
            const { lotId, startDate, endDate } = req.query;
            const { whereClause, replacements } = this.buildFilters(lotId, startDate, endDate, 'week::date');

            const stats = await sequelize.query(
                `
                SELECT
                    week,
                    parking_lot_id,
                    total_reservations,
                    avg_daily_reservations,
                    peak_daily_count,
                    peak_day_date,
                    low_daily_count,
                    low_day_date,
                    peak_hour
                FROM stats_weekly
                ${whereClause}
                ORDER BY week, parking_lot_id
                `,
                {
                    replacements,
                    type: QueryTypes.SELECT
                }
            );

            return res.status(200).json(stats);
        } catch (err) {
            next(err);
        }
    }

    async getMonthlyStatsByLot(req, res, next) {
        try {
            const { lotId, startDate, endDate } = req.query;
            const { whereClause, replacements } = this.buildFilters(lotId, startDate, endDate, 'month::date');

            const stats = await sequelize.query(
                `
                SELECT
                    month,
                    parking_lot_id,
                    total_reservations,
                    avg_daily_reservations,
                    peak_daily_reservations,
                    low_daily_reservations,
                    most_common_peak_dow,
                    daily_stddev
                FROM stats_monthly
                ${whereClause}
                ORDER BY month, parking_lot_id
                `,
                {
                    replacements,
                    type: QueryTypes.SELECT
                }
            );

            return res.status(200).json(stats);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ReportsController();
