const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const { User } = require('./user.js');

const References = sequelize.define('References', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    code: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    dayEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0
        
    }
});

References.belongsTo(User, {
    foreignKey: {
        allowNull: false,
        name: 'userId' 
    },
});

References.belongsTo(User, {
    foreignKey: {
        allowNull: false,
        name: 'referanceOwner'
    },
});

References.findByUserId = async function (id) {
    
    return await this.findOne({
      where: {
        userId: id,
      },
    });
  };

References.findAllByReferenceOwner = async function (userId) {
    return await this.findAll({
        where: {
            referanceOwner: userId
        }
    })
}

References.findById = async function (id) {
    
    return await this.findOne({
      where: {
        id: id,
      },
    });
  };

module.exports = { References }
