const express = require('express');
const app = require('./app'); 

const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

module.exports =  function startServer() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
