// testStoreUserData.js
const { storeUserData } = require('./controllers/userController');

(async () => {
    try {
        await storeUserData('testuser', 12345, 'testchatid');
        console.log('Test data successfully stored.');
    } catch (error) {
        console.error('Error during test data storage:', error);
    }
})();
