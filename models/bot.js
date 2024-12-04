const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const status = {
    working: 'working',
    notWorking: 'notWorking',
    care: "care"
  };

const Bot = sequelize.define('Bot', {
    
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    version: {
        type: DataTypes.STRING,
        defaultValue: 0
      },
    
    status: {
        type: DataTypes.ENUM,
        values: Object.values(status), 
      },
      
});

module.exports = { Bot, status };