const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const { User } = require('./user')

const Buttons = sequelize.define('Buttons', {
    
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    button1: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
    
      button2: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      
      button3: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },

      button4: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        
      },

});

Buttons.belongsTo(User, {
    foreignKey: {
        allowNull: false,
        unique: true
    },
});


Buttons.findByUserId = async function (id) {
    
  return await this.findOne({
    where: {
      UserId: id,
    },
  }) || null;
};



module.exports = { Buttons };