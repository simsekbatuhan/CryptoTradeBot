const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ChangeLog = sequelize.define('ChangeLog', {
    
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    version: {
        type: DataTypes.STRING,
        defaultValue: 0
      },
    
    log: {
        type: DataTypes.TEXT,
      },
      
});

module.exports = { ChangeLog };