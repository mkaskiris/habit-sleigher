require('dotenv').config();

const express = require('express');
const router = express.Router();
const Habit = require('../model/Habit');
const {verifyToken} = require('../middleware/auth')


router.get('/', verifyToken, async (req, res) => {
    try {
        const allHabits = await Habit.all;
        res.status(200).json(allHabits)
    }  catch (err) {
        res.status(500).send({ err })
    }
})

router.get('/:name', verifyToken, async (req, res) => {
    try {
        const habit = await Habit.getByName(req.params.name);
        res.status(200).json(habit)
    } catch (err) {
        res.status(500).send({ err })
    }
})

router.post('/:user_id', async (req, res) => {
    try {
        const {user_id} = req.params
        const habit = await Habit.createHabit({...req.body, user_id})
        res.status(201).json(habit)
    } catch (err) {
        res.status(500).send({ err })
    }
})

router.put('/update/:habit_id', async (req, res) => {
    try {
        const {habit_id} = req.params;
        const update = await Habit.appendFreq(habit_id);
        res.status(201).json(update)

    } catch (err) {
        res.status(500).send({ err })
    }
})

router.get('/habits/:habit_id/:user_id', async (req, res) => {
    try {
        const {habit_id, user_id} = req.params
        const getData = await Habit.getHabits(habit_id, user_id)
        res.status(201).json(getData.rows)
    } catch (err) {
        res.status(403).send({err: err})
    }
})

router.get('/habits/oldhabits/entries/:id', async (req, res) => {
    try {
        const {id} = req.params
        const entries = await Habit.getOldHabits(id);
        res.status(200).json(entries)
    } catch (err) {
        res.status(403).send({ err: "ERROR RETREIVING OLD HABITS" })
    }
})

router.post('/:username/habits/entries', async (req, res) => {
    try {
        //check if valid jwt is for the requested user
        // if (res.locals.user !== req.params.username) throw err
        const habit = await Habit.newHabitEntry({ ...req.body, date: new Date().toLocaleString('en-US', {timeZone: 'Europe/London'})});
        res.status(201).json(habit)
      } catch (err) {
        res.status(403).send({ err: err })
      }
})


router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const deleteHabit = await Habit.deleteHabit(req.params.id);
        res.status(202).json(deleteHabit)

    } catch (err) {
        res.status(500).send({ err })
    }
})
module.exports = router