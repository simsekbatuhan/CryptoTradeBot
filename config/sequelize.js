const { Sequelize } = require('sequelize');


const sequelize = new Sequelize( {
  username: "",
  database: "",
  password: "",
  host: '',
  dialect: 'mysql',
  logging: false, 
  
  reconnect: {
    maxRetries: 5,
    minDelay: 5000,
    maxDelay: 60000,
},

});


module.exports = sequelize;