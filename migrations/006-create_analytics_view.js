'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Create daily stats materialized view
        await queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS stats_daily AS
      SELECT 
        DATE(created_at) as date,
        EXTRACT(HOUR FROM created_at) as hour,
        parking_lot_id,
        COUNT(*) as total_reservations,
        AVG(length) as avg_duration_minutes,
      FROM reservations
      GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at), parking_lot_id
      WITH DATA;
    `);

        // Add indexes to daily view
        await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_stats_daily_date 
      ON stats_daily (date);
      
      CREATE INDEX IF NOT EXISTS idx_stats_daily_lot 
      ON stats_daily (parking_lot_id);
    `);

        // 2. Create weekly stats materialized view
        await queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS stats_weekly AS
      SELECT 
        DATE_TRUNC('week', date) as week,
        parking_lot_id,
        SUM(total_reservations) as total_reservations,
        AVG(total_reservations) as avg_daily_reservations,
        
        MAX(total_reservations) as peak_daily_count,
        -- Add the actual date of peak day
        (SELECT date FROM stats_daily d2 
            WHERE d2.parking_lot_id = d1.parking_lot_id 
            AND DATE_TRUNC('week', d2.date) = DATE_TRUNC('week', d1.date)
            AND d2.total_reservations = MAX(d1.total_reservations)
            LIMIT 1) as peak_day_date,
            
        MIN(total_reservations) as low_daily_count,
        -- Add the actual date of low day
        (SELECT date FROM stats_daily d2 
            WHERE d2.parking_lot_id = d1.parking_lot_id 
            AND DATE_TRUNC('week', d2.date) = DATE_TRUNC('week', d1.date)
            AND d2.total_reservations = MIN(d1.total_reservations)
            LIMIT 1) as low_day_date,        
        
        MODE() WITHIN GROUP (ORDER BY hour) as peak_hour
      FROM stats_daily d1
      GROUP BY DATE_TRUNC('week', date), parking_lot_id
      WITH DATA;
    `);

        // 3. Create monthly stats materialized view
        await queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS stats_monthly AS
      SELECT 
        DATE_TRUNC('month', date) as month,
        parking_lot_id,
        SUM(total_reservations) as total_reservations,
        AVG(total_reservations) as avg_daily_reservations,
        MAX(total_reservations) as peak_daily_reservations,
        
        (SELECT date FROM stats_daily d2 
            WHERE d2.parking_lot_id = d1.parking_lot_id 
            AND DATE_TRUNC('month', d2.date) = DATE_TRUNC('month', d1.date)
            AND d2.total_reservations = MAX(d1.total_reservations)
            LIMIT 1) as peak_day_date,
           
        MIN(total_reservations) as low_daily_reservations
        
        (SELECT date FROM stats_daily d2 
            WHERE d2.parking_lot_id = d1.parking_lot_id 
            AND DATE_TRUNC('month', d2.date) = DATE_TRUNC('month', d1.date)
            AND d2.total_reservations = MIN(d1.total_reservations)
            LIMIT 1) as low_day_date
        
      FROM stats_daily d1
      GROUP BY DATE_TRUNC('month', date), parking_lot_id
      WITH DATA;
    `);

        // 4. Create peak hours analysis
        await queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS stats_peak_hours AS
      SELECT 
        hour,
        parking_lot_id,
        AVG(total_reservations) as avg_reservations,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_reservations) as median_reservations,
        MAX(total_reservations) as max_reservations
      FROM stats_daily
      GROUP BY hour, parking_lot_id
      WITH DATA;
    `);

        // 5. Set up auto-refresh with pg_cron
        await queryInterface.sequelize.query(`
      SELECT cron.schedule(
        'refresh-daily-stats',
        '0 1 * * *', -- 1 AM daily
        'REFRESH MATERIALIZED VIEW CONCURRENTLY stats_daily'
      );
      
      SELECT cron.schedule(
        'refresh-weekly-stats', 
        '0 2 * * 1', -- 2 AM every Monday
        'REFRESH MATERIALIZED VIEW CONCURRENTLY stats_weekly'
      );
      
      SELECT cron.schedule(
        'refresh-monthly-stats',
        '0 3 1 * *', -- 3 AM on 1st of month
        'REFRESH MATERIALIZED VIEW CONCURRENTLY stats_monthly'
      );
      
      SELECT cron.schedule(
        'refresh-peak-hours',
        '0 4 * * *', -- 4 AM daily
        'REFRESH MATERIALIZED VIEW CONCURRENTLY stats_peak_hours'
      );
    `);
    },

    async down(queryInterface, Sequelize) {
        // Remove cron jobs
        await queryInterface.sequelize.query(`
      SELECT cron.unschedule('refresh-daily-stats');
      SELECT cron.unschedule('refresh-weekly-stats');
      SELECT cron.unschedule('refresh-monthly-stats');
      SELECT cron.unschedule('refresh-peak-hours');
    `);

        // Drop materialized views
        await queryInterface.sequelize.query(`
      DROP MATERIALIZED VIEW IF EXISTS stats_daily CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS stats_weekly CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS stats_monthly CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS stats_peak_hours CASCADE;
    `);
    }
};