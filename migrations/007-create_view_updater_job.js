'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      -- Create pg_cron extension if not exists
      CREATE EXTENSION IF NOT EXISTS pg_cron;
    `);

    // Schedule daily refresh every 10 minutes
    await queryInterface.sequelize.query(`
      SELECT cron.schedule('refresh-stats-daily', '*/10 * * * *', $$
        REFRESH MATERIALIZED VIEW CONCURRENTLY stats_daily;
      $$);
    `);

    // Schedule weekly refresh at 00:00 on Sundays
    await queryInterface.sequelize.query(`
      SELECT cron.schedule('refresh-stats-weekly', '0 0 * * 1', $$
        REFRESH MATERIALIZED VIEW CONCURRENTLY stats_weekly;
      $$);
    `);

    // Schedule monthly refresh at 00:15 on the 1st
    await queryInterface.sequelize.query(`
      SELECT cron.schedule('refresh-stats-monthly', '15 0 1 * *', $$
        REFRESH MATERIALIZED VIEW CONCURRENTLY stats_monthly;
      $$);
    `);

    // Schedule peak hours refresh every hour at minute 0
    await queryInterface.sequelize.query(`
      SELECT cron.schedule('refresh-stats-peak-hours', '0 * * * *', $$
        REFRESH MATERIALIZED VIEW CONCURRENTLY stats_peak_hours;
      $$);
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove all scheduled jobs
    await queryInterface.sequelize.query(`
      SELECT cron.unschedule('refresh-stats-daily');
      SELECT cron.unschedule('refresh-stats-weekly');
      SELECT cron.unschedule('refresh-stats-monthly');
      SELECT cron.unschedule('refresh-stats-peak-hours');
    `);
  }
};