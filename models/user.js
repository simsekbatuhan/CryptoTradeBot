const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Language = {
  TR: 'TR',
  UK: 'UK',
  EN: 'EN',
  RU: 'RU',
};

const User = sequelize.define('User', {
    
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  telegramId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true, 
  },
  
  language: {
    type: DataTypes.ENUM,
    values: Object.values(Language), 
    allowNull: false,
    defaultValue: Language.EN,
  },

  subscriptionEnd: {
    type: DataTypes.DATE,
  },

  subscribe: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  referenceCode: {
    type: DataTypes.STRING(6),
    unique: true
  }
});

User.createReferanceCode = async function (user) {
    
  let referenceCode = generateReferenceCode();
  
  let uniqueCode = await isUniqueCode(referenceCode);
  
  while (!uniqueCode) {
    referenceCode = generateReferenceCode();
    uniqueCode = await isUniqueCode(referenceCode);
  }
  
  const userpk = await User.findByPk(user.id)
  userpk.referenceCode = referenceCode
  userpk.save()
  return await referenceCode
};


function generateReferenceCode() {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}


async function isUniqueCode(code) {
  const existingUser = await User.findOne({ where: { referenceCode: code } });
  return !existingUser;
}

User.findByReferenceCode= async function (code) {
  return await this.findOne({
    where: {
      referenceCode: code,
    },
  });
};

User.findByTelegramId = async function (telegramId) {
  return await this.findOne({ where: { telegramId: telegramId } });
};

User.findById = async function (id) {
  return await this.findOne({ where: { id: id } });
};

User.existTelegramId = async function (telegramId) {
  const user = await this.findByTelegramId(telegramId);
  return !!user; 
};

module.exports = { User, Language };
