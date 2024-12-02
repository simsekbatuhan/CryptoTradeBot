const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const { User } = require('./user')

const markets = {
  binance: 'binance',
  bybit: 'bybit',
  empty: "empty"
};

const Market = sequelize.define('Market', {
    
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

  market: {
      type: DataTypes.ENUM,
      values: Object.values(markets), 
      allowNull: false,
      defaultValue: markets.empty, 
    },

    apiKey: {
        type: DataTypes.STRING,
    },

    secretKey: {
      type: DataTypes.STRING,
  },

});

Market.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },
});


Market.findByUserId = async function (id) {
    
  return await this.findOne({
    where: {
      UserId: id,
    },
  });
};



module.exports = { Market, markets };