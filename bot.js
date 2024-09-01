const TelegramBot = require('node-telegram-bot-api');
const { storeUserData } = require('./controllers/userController');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 3000;
const token = process.env.TELEGRAM_BOT_TOKEN;
const botUrl = process.env.BOT_URL;
const bot = new TelegramBot(token, { polling: true });


bot.onText(/\/start/, async (msg) => {
    const username = msg.from.username;
    const userId = msg.from.id; // Added userId

    // Store user data in the database
    try {
        await storeUserData(username, userId);
        console.log('User data stored successfully');
    } catch (error) {
        console.error('Error storing user data:', error);
    }

    const serverUrl = `${botUrl}:${PORT}/${username}/${userId}`;

    // Define the options with the inline keyboard button
    const options = {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Click here to proceed', url: serverUrl }
            ]]
        }
    };

    try {
        await bot.sendMessage(userId, `Welcome to JayGee, ${username} Click the button below to proceed`, options);
        console.log(`Sent message with link button to user ${username}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

bot.onText(/\/connect/, async (msg) => {
    const username = msg.from.username;
    const userId = msg.from.id; // Added userId

    // Store user data in the database
    try {
        await storeUserData(username, userId);
        console.log('User data stored successfully');
    } catch (error) {
        console.error('Error storing user data:', error);
    }

    const serverUrl = `${botUrl}:${PORT}/${username}/${userId}`;

    // Define the options with the inline keyboard button
    const options = {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Click here to proceed', url: serverUrl }
            ]]
        }
    };

    try {
        await bot.sendMessage(userId, `Welcome to JayGee, ${username} Click the button below to proceed`, options);
        console.log(`Sent message with link button to user ${username}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

module.exports = function startBot() {
    console.log("Bot is starting...");
};

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
