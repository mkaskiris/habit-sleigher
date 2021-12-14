require('dotenv').config();

const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/auth')
const habitController = require('../controllers/habit')


router.get('/', verifyToken, habitController.getHabits)
router.get('/:name', verifyToken, habitController.getName)
router.post('/:username', habitController.create)
router.put('/update/:habit_id', habitController.update)
router.get('/habits/:habit_id/:username', habitController.getUserHabits)
router.get('/habits/oldhabits/entries/:id', habitController.getOldHabit )
router.post('/:username/habits/entries', habitController.updateHabitCounter)
router.delete('/delete/:id', verifyToken, habitController.destroy)