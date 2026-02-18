const { sequelize } = require('../models');

class ReportsController {
    // TODO adapt to my table
    async getDailyStatsByLot(req, res, next) {
        try{
            const { lotId, startDate, endDate } = req.query;

            const stats = await sequelize.query(`
    SELECT 
      date,
      ${lotId === '*' ? 'SUM(total_reservations) as total_reservations' : 'total_reservations'},
      ${lotId === '*' ? 'SUM(spots_used) as total_spots_used' : 'spots_used'}
    FROM stats_daily
    WHERE date BETWEEN :startDate AND :endDate
      ${lotId !== '*' ? 'AND parking_lot_id = :lotId' : ''}
    GROUP BY date
    ${lotId !== '*' ? 'AND parking_lot_id' : ''}
    ORDER BY date
  `, {
                replacements: {
                    lotId: lotId === '*' ? null : lotId,
                    startDate,
                    endDate
                }
            });

            res.json(stats);
        }catch(err){
            next(err);
        }
    }

    async getWeeklyStatsByLot(req, res, next) {
        try{

        }catch(err){
            next(err);
        }
    }

    async getMonthlyStatsByLot(req, res, next) {
        try{

        }catch(err){
            next(err);
        }
    }

}

module.exports = new ReportsController();