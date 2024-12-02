const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.js');
const { User } = require('./user.js');

const Status = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECT: 'reject',
};

const Payments = sequelize.define('payments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(Status),
        defaultValue: Status.PENDING,
    },

    description: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    
    subPackage: {
        type: DataTypes.JSON,
        
    },

    walletAdress: {
        type: DataTypes.STRING,
        allowNull: false,
    },


    coinName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    sendingAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    requiredAmount: {
        type: DataTypes.FLOAT
    }

});

Payments.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },
});

Payments.findById = async function (id) {
    return await this.findOne({
        where: {
            id: id,
        },
    });
};

Payments.findByUserId = async function (userId) {
    const payments = await this.findAll({
        where: {
            userId: userId,
        },
    });
    return payments.map(payment => payment.dataValues); 
};


Payments.findByTxid = async function (txid) {
    return await this.findAll({
        where: {
            txid: txid,
        },
    });
};


Payments.existTxid= async function (txid) {  
    const payment = await this.findByTxid(txid);
    return !!payment; 
  };
  
    
module.exports = { Payments, Status };