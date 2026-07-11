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
            AVG(length) as avg_duration_minutes
          FROM reservations
          GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at), parking_lot_id
          WITH DATA;
        `);

        // Add indexes to daily view
        await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_stats_daily_date ON stats_daily (date);
        `);

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS idx_stats_daily_lot ON stats_daily (parking_lot_id);
        `);

        // Add unique index for concurrent refresh
        await queryInterface.sequelize.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_daily_unique ON stats_daily (date, hour, parking_lot_id);
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
            (ARRAY_AGG(date ORDER BY total_reservations DESC))[1] as peak_day_date,
            MIN(total_reservations) as low_daily_count,
            (ARRAY_AGG(date ORDER BY total_reservations ASC))[1] as low_day_date,
            MODE() WITHIN GROUP (ORDER BY hour) as peak_hour
          FROM stats_daily
          GROUP BY DATE_TRUNC('week', date), parking_lot_id
          WITH DATA;
        `);

        await queryInterface.sequelize.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_weekly_unique ON stats_weekly (week, parking_lot_id);
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
            MIN(total_reservations) as low_daily_reservations,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(DOW FROM date)) as most_common_peak_dow,
            STDDEV(total_reservations) as daily_stddev
          FROM stats_daily
          GROUP BY DATE_TRUNC('month', date), parking_lot_id
          WITH DATA;
        `);

        await queryInterface.sequelize.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_monthly_unique ON stats_monthly (month, parking_lot_id);
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

        await queryInterface.sequelize.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_peak_hour_unique ON stats_peak_hours (hour, parking_lot_id);
        `);
    },

    async down(queryInterface, Sequelize) {
        // Drop materialized views in reverse dependency order
        await queryInterface.sequelize.query(`
            DROP MATERIALIZED VIEW IF EXISTS stats_peak_hours CASCADE;
        `);

        await queryInterface.sequelize.query(`
            DROP MATERIALIZED VIEW IF EXISTS stats_monthly CASCADE;
        `);

        await queryInterface.sequelize.query(`
            DROP MATERIALIZED VIEW IF EXISTS stats_weekly CASCADE;
        `);

        await queryInterface.sequelize.query(`
            DROP MATERIALIZED VIEW IF EXISTS stats_daily CASCADE;
        `);
    }
};