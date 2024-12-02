const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require("croxydb");
db.setFolder("./database");

const logsDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

function getFormattedDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

const latestLogPath = path.join(logsDir, 'latest.log');

function checkDateAndRotateLogs() {
    const today = getFormattedDate(new Date());
    let currentLogDate = db.get('currentLogDate') || getFormattedDate(new Date());
    if (today !== currentLogDate) {

        const archivedLogPath = path.join(logsDir, `${currentLogDate}.log`);
        if (fs.existsSync(latestLogPath)) {
            fs.renameSync(latestLogPath, archivedLogPath);
        }

        currentLogDate = today;
        db.set('currentLogDate', currentLogDate);

        fs.writeFileSync(latestLogPath, ''); 
    }
}

setInterval(checkDateAndRotateLogs, 60 * 1000); 

function logMessage(message) {
    checkDateAndRotateLogs();

    const now = new Date();
    

    const formatDate = (date) => {
        if (!date) return null;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const formattedDate = formatDate(now);
    const timestamp = `[${formattedDate}]`;
    const logEntry = `${timestamp} ${message}${os.EOL}`;

    fs.appendFile(latestLogPath, logEntry, (err) => {
        if (err) {
            console.error('Log yazılamadı:', err);
        }
    });
}

module.exports = {
    logMessage
};
