const Habit = require('../model/Habit');

async function getHabits (req, res){
    try {
        const allHabits = await Habit.all;
        res.status(200).json(allHabits)
    }  catch (err) {
        res.status(500).send({ err })
    }
}

async function getName (req, res){
    try {
        const habit = await Habit.getByName(req.params.name);
        res.status(200).json(habit)
    } catch (err) {
        res.status(500).send({ err })
    }
}

async function create (req, res){
    try {
        const {username} = req.params
        const habit = await Habit.createHabit({...req.body, username})
        res.status(201).json(habit)
    } catch (err) {
        res.status(500).send({ err })
    }
}

async function update (req, res){
    try {
        const {habit_id} = req.params;
        const update = await Habit.updateStreak(habit_id);
        res.status(201).json(update)
    } catch (err) {
        res.status(500).send({ err: "error updating counter" })
    }
}

async function getUserHabits (req, res){
    try {
        const {habit_id, username} = req.params
        const getData = await Habit.getHabits(habit_id, username)
        res.status(201).json(getData.rows)
    } catch (err) {
        res.status(403).send({err: err})
    }
}

//changed test again
async function getOldHabit(req, res) {
    try {
        const {id} = req.params
        const entries = await Habit.getOldHabits(id);
        res.status(200).json(entries)
    } catch (err) {
        res.status(403).send({ err: "ERROR RETREIVING OLD HABITS" })
    }
}

async function updateHabitCounter(req, res) {
    try {
        //check if valid jwt is for the requested user
        // if (res.locals.user !== req.params.username) throw err
        const habit = await Habit.newHabitEntry({ ...req.body, date: new Date().toLocaleString('en-US', {timeZone: 'Europe/London'})});
        res.status(201).json(habit)
      } catch (err) {
        res.status(403).send({ err: err })
      }
}

async function destroy(req, res){
    try {
        const deleteHabit = await Habit.deleteHabit(req.params.id);
        res.status(202).json(deleteHabit)

    } catch (err) {
        res.status(500).send({ err })
    }
}

module.exports = {
        getHabits,
        getName,
        create,
        update,
        getUserHabits,
        getOldHabit,
        updateHabitCounter,
        destroy
    }