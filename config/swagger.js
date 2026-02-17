const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Fast Stop',
        description: 'Parking management system API'
    },
    host: 'localhost:3000',
    snakeCase: true,
    common: {
        parameters: {}, // OpenAPI conform parameters that are commonly used
        headers: {}, // OpenAPI conform headers that are commonly used
    },
    schemes: ['http']
};

const outputFile = '../docs/swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);