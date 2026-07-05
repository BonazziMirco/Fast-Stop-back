'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};

// Use the application's configured sequelize instance so models that initialize
// themselves (via Device.init(...) etc.) share the same connection.
const sequelize = require(__dirname + '/../config/database');

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const imported = require(path.join(__dirname, file));

    // Some model files export a function (sequelize-cli style):
    //   module.exports = (sequelize, DataTypes) => { ... }
    // Others export a Model class that has already been initialized against
    // the shared `sequelize` instance and therefore should be used directly.
    let model;
    if (typeof imported === 'function' && imported.prototype && imported.prototype.constructor.name === 'Function') {
      // If it's a factory function, call it with our sequelize and DataTypes
      try {
        model = imported(sequelize, Sequelize.DataTypes);
      } catch (e) {
        // If calling fails (for example the import is a class), fall back to using the import directly
        model = imported;
      }
    } else {
      model = imported;
    }

    if (model && model.name) {
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
