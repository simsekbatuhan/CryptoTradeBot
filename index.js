const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const bybit = require('./marketServices/bybit')
//bybit.fillSymbols()

const sequelize = require('./config/sequelize');
const settings = require('./config/settings');
const settingsRoutes = require('./routes/routes');
const news = require('./news')
const telegramBot = require('./telegramBot/bot');
const tokenService = require('./services/tokenService')
const log = require('./log')
const app = express();
app.use(cors());
app.use(express.json());


const dosyalar = fs.readdirSync("./models");
for (const dosya of dosyalar) {
    const dosyaYolu = path.join("./models", dosya);
    if (fs.lstatSync(dosyaYolu).isFile()) {
        const xx = require(`./${dosyaYolu}`);
    }
}

const checkHeader = async (req, res, next) => {
  const token = req.get('token');
  if (req.originalUrl.includes('/admin/')) {
    try {
      const isValidToken = await tokenService.isExpired(token);
      if (isValidToken) {
        next();
      } else {
        res.status(400).send({ message: 'Invalid authorization' });
      }
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(400).send({ message: 'Invalid authorization' });
    }
  } else {
    next();
  }
};
app.use(checkHeader);

const checkDatabaseConnection = () => {
  sequelize
    .authenticate()
    .then(() => console.log('Database connection successful.'))
    .catch(err => {
      console.error('Database connection error:', err);
      log.logMessage('Database connection error:', err)
      sequelize.sync();
    });
};

sequelize.sync()
  .then(() => console.log("Database synchronized with model changes."))
  .catch((error) => console.error("Error synchronizing database:", error));

setInterval(checkDatabaseConnection, 5 * 60 * 1000);

app.use('/', settingsRoutes);

const PORT = settings.port || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  log.logMessage(`Server is running on port ${PORT}`)
});
