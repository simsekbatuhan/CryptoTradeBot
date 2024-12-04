const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize( {
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_DATABASE,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  logging: false, 
  
  reconnect: {
    maxRetries: 5,
    minDelay: 5000,
    maxDelay: 60000,
},

});


module.exports = sequelize;