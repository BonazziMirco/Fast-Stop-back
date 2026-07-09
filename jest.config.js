module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'config/**/*.js',
    '!config/swagger.js',
    '!node_modules/**'
  ],
  verbose: true,
  testTimeout: 10000
};

