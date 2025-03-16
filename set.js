
const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEIyVms4ZVg4aVZIUHdwSXAzYmN4SURSMEg2dHNlS0U1MDUvSTRJS3duZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaG9mOVRFVEpZc2JyZ0xFcmlDYW5CbmJkQk04K09CaEtFR1BwNDhBd2lGVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpQ1NvWVgxM3VTRklLY1NNVFNIOGp1dHMxUktvNmNHdm9Tc1d4VjNsTmtrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJQR2IwTEhzMUlDWC9STkg0ZzVwMWRMaUhJa3hmYjRQZjllN25pcnZ1N3hBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldQT1NwaExGbXZvZWtqWVQzdW9BYkJoV2RHRFYrZ0J6RTZJOEk3cjUyMnM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlCSUpRbkFQVHhDVW53aVBrQjdEbERWTFV2a0JTZ095QUlMWFQ5ZVJKbjA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0h1U0pHeDVTQksvdlBNRVUvd2Y0b0NDTFdPL0Voa2tna1VNMkJtek4yOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY2VuODZHZGtoR01oR3NESGFXZVhDNUZiVU9QeHU5SU5yZVNJcWZnWGtCRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlpXd25SSzVndE9xZEhreGFaZkI0WGlXZGtSaVdBN3dIekp4bHliZ1RUUEQwNzliZnd2K0tYeEYxbHNERUdjcU5RK0s4YjMxVmwzVEFzM0l4d2JEUGlBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTg5LCJhZHZTZWNyZXRLZXkiOiJkbWRHaGxQOVR6Y0lUQ2lkMXlrQ2Jlb2RNOG9nS3NybmF3bGxXQVh6K0pBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJaUnZXTDVzOVJDT1h6ZzZZSGVMSUhnIiwicGhvbmVJZCI6IjMxZGM1NzllLTExOTYtNGQ2Mi04ZTQxLWMzODBlMTgxY2FiZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJRSy9aUE9JNVZCb2pqRExyejZEZHVHdmtuMnc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidmdsbDJxQ1RGR3N3cjAwME1hb29WRnFhNFNJPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkJGVDRaS0xOIiwibWUiOnsiaWQiOiI0MDc3MDgxMTkyOToxN0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUCtoNVBRRUVPanIzTDRHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiSVdSem5vNGJyY21pV0VGc1VGYk5qbnlLcDh6NUl2elFUWWdsSVRuTzBoWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiS3JJZDRVbmtjOGJER1Qvek80UFpJbHNzbXBZUXhJck1vZlIwTEEzODVCY3pPSVZ0UnNmVU9YbTR0R0pHNDV4UjI4aDRVWHVCczJxS1hjaWd4OGR3Qnc9PSIsImRldmljZVNpZ25hdHVyZSI6Ik55RWxhQkp1UitDaFdub0g5Rnpkd21OdVVKTS9HZ04zbStUb1IvaFppemxDUnVRRUg3SEtUQTdmOGl4dFBkRDNXWk4vVEZNeEdnZXhkeDZMY0Y4UmhnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiNDA3NzA4MTE5Mjk6MTdAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCU0ZrYzU2T0c2M0pvbGhCYkZCV3pZNThpcWZNK1NMODBFMklKU0U1enRJVyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0MjE1NzMwMSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFPS2kifQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "cosmin",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "0770811929",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTICALL : process.env.ANTICALL || 'no',
                  AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
                  AUTO_READ : process.env.AUTO_READ || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
