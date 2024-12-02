const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const { User } = require('./user.js');

const Token = sequelize.define('Token', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    token: {
        type: DataTypes.STRING,
    },

    code: {
        type: DataTypes.INTEGER,
    },

    expireDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    createdAt: {
        type: DataTypes.STRING
    }

});

Token.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },
});

Token.findByUserId = async function (id) {

    return await this.findOne({
        where: {
            UserId: id,
        },
    });
};

Token.findByToken = async function (token) {

    return await this.findOne({
        where: {
            token: token,
        },
    });
};

module.exports = { Token };