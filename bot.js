const http = require('http'); // Import the HTTP module, bcos of render deployment.
const TelegramBot = require('node-telegram-bot-api');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const { storeUserData } = require('./controllers/userController');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;
const token = process.env.TELEGRAM_BOT_TOKEN;
const botUrl = process.env.BOT_URL;


let bot;

// Define a task to "ping" the bot's server (keep-alive task)
const scheduler = new ToadScheduler();

const keepAliveTask = new Task('keep alive', () => {
    const url = process.env.RENDER_URL || 'https://jay-gee-fe.vercel.app'; // Your Render app URL
    axios.get(url)
        .then(response => {
            console.log('Keep-alive ping successful:', response.status);
        })
        .catch(error => {
            console.error('Keep-alive ping failed:', error);
        });
});

// Set up a SimpleIntervalJob (for example, every 1 minutes)
const job = new SimpleIntervalJob({ minutes: 1 }, keepAliveTask);

// Add the job to the scheduler
scheduler.addSimpleIntervalJob(job);

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

            const webAppUrl = `${botUrl}/${username}/${userId}`;

            const options = {
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: 'Click To Proceed',
                            web_app: { url: webAppUrl }
                        }
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

            const serverUrl = `${botUrl}/${username}/${userId}`;


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

// Simple HTTP server to keep Render happy in other to assume web service
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running\n');
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


// Catch unhandled exceptions and restart the bot
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.log('Restarting bot...');
    startBot();
});

startBot();

module.exports = bot;


