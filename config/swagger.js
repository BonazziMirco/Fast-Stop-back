const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Fast Stop',
        description: 'Parking management system API',
        version: '1.0.0'
    },
    host: 'localhost:3333',
    common: {
        parameters: {}, // OpenAPI conform parameters that are commonly used
        headers: {}, // OpenAPI conform headers that are commonly used
    },
    schemes: ['http']
};

const outputFile = '../docs/swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);