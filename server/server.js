require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())

const userController = require('./controllers/user.js')
const habitController = require('./controllers/habit')
app.use('/', userController)
app.use('/habits', habitController)


app.all('*', (req, res) => {
    res.redirect('/habits')
})

module.exports = app