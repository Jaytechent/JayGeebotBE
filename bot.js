const TelegramBot = require('node-telegram-bot-api');
const { storeUserData } = require('./controllers/userController');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;
const token = process.env.TELEGRAM_BOT_TOKEN;
const botUrl = process.env.BOT_URL;

let bot;

const startBot = () => {
    try {
        bot = new TelegramBot(token, { polling: true });

        bot.onText(/\/start/, async (msg) => {
            const username = msg.from.username;
            const userId = msg.from.id;

            try {
                await storeUserData(username, userId);
                console.log('User data stored successfully');
            } catch (error) {
                console.error('Error storing user data:', error);
            }

            const serverUrl = `${botUrl}:${PORT}/${username}/${userId}`;

            const options = {
                reply_markup: {
                    inline_keyboard: [[
                        { text: 'Click here to proceed', url: serverUrl }
                    ]]
                }
            };

            try {
                await bot.sendMessage(userId, `Welcome to JayGee, ${username}. Click the button below to proceed`, options);
                console.log(`Sent message with link button to user ${username}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        bot.onText(/\/connect/, async (msg) => {
            const username = msg.from.username;
            const userId = msg.from.id;

            try {
                await storeUserData(username, userId);
                console.log('User data stored successfully');
            } catch (error) {
                console.error('Error storing user data:', error);
            }

            const serverUrl = `${botUrl}:${PORT}/${username}/${userId}`;

            const options = {
                reply_markup: {
                    inline_keyboard: [[
                        { text: 'Click here to proceed', url: serverUrl }
                    ]]
                }
            };

            try {
                await bot.sendMessage(userId, `Welcome to JayGee, ${username}. Click the button below to proceed`, options);
                console.log(`Sent message with link button to user ${username}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        bot.on('polling_error', (error) => {
            console.error('Polling error:', error);
            console.log('Bot encountered an error and will restart...');
            setTimeout(startBot, 10000); // Restart the bot after 10 seconds
        });

        console.log('Bot started');
    } catch (error) {
        console.error('Bot failed to start:', error);
        console.log('Retrying bot startup in 10 seconds...');
        setTimeout(startBot, 10000); // Retry after 10 seconds if an error occurs during startup
    }
};

// Catch unhandled exceptions and restart the bot
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.log('Restarting bot...');
    startBot();
});

startBot();

module.exports = bot;


// const TelegramBot = require('node-telegram-bot-api');
// const dotenv = require('dotenv');

// dotenv.config();

// const token = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(token, { polling: true });

// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;
//     const username = msg.from.username;
//     const userId = msg.from.id; // Added userId

//     const serverUrl = `http://localhost:${process.env.PORT}/${username}/${userId}`;
//     const message = `[Click here to proceed](${serverUrl})`;
//     bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    
// });

// bot.onText(/\/connect/, (msg) => {
//     // const chatId = msg.chat.id;
//     const username = msg.from.username;
//     const userId = msg.from.id; // Added userId

//     const serverUrl = `http://localhost:${process.env.PORT}/${username}/${userId}`;
//     const message = `[Click here to proceed](${serverUrl})`;
//     bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

// });

// module.exports = bot;
