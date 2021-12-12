const db = require('../db/db.js');

module.exports = class Habit {
    constructor(data) {
        this.habit_id = data.habit_id,
        this.habit = data.habit,
        this.user_id = data.user_id,
        this.currTime = data.currTime,
        this.currfreq = data.currfreq,
        this.frequency = data.frequency
    }


    static get all(){
        return new Promise(async (resolve, reject) => {
            try {
                let result = await db.query(`SELECT * FROM habit`);
                let habits = result.rows.map(r => new Habit(r))
                resolve(habits)
            } catch (err) {
                reject(`Error retrieving habits: ${err}`)
            }
        })
    }
    
    static getByName(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const allHabits = await db.query("SELECT * FROM habit INNER JOIN user_table ON (habit.user_id = user_table.user_id) AND (user_table.username = $1) ORDER BY habit_id DESC;", [name]);
                let habits = allHabits.rows.map(r => new Habit(r))
                resolve(habits)

            } catch (err) {
                reject("Error getting name: ", err)
            }
        })
    }

    static getOldHabits(id) {
        return new Promise (async (resolve, reject) => { 
            try {
                const arr = []
               
                const dayBefore = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 1;`, [id]);
                const dayBefore2 = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 2;`, [id]);
                const dayBefore3 = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 3;`, [id]);
                
                arr.push(parseInt(dayBefore.rows[0].count))
                arr.push(parseInt(dayBefore2.rows[0].count))
                arr.push(parseInt(dayBefore3.rows[0].count))
                resolve(arr)

            } catch(err) {
                reject("Error getting old habits: ", err)
            }
        })
    }

    static createHabit({habit, frequency, user_id}) {
        return new Promise (async (resolve, reject) => {
            try {
                const getUser = await db.query("SELECT user_id FROM user_table WHERE username = $1", [user_id])
              
                const newHabit = await db.query("INSERT INTO habit (habit, currFreq, frequency, currTime, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [habit, 0, frequency, new Date().toLocaleDateString('en-GB'), getUser.rows[0].user_id])
                let habit1 = new Habit(newHabit.rows[0]);
                resolve(habit1)
        
            } catch(err) {
                reject("Error creating habit: ", err)
            }
        })

    }

    static deleteHabit(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteHabit = await db.query("DELETE FROM habit WHERE habit_id = $1", [id])
                resolve(deleteHabit)
            } catch (err) {
                reject("Error deleting habit: ", err)
            }
        })
    }

    static getHabits(habit_id, user_id) {
        return new Promise(async (resolve, reject) => {

            try {
                const currFreq = await db.query("SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date", [habit_id]);
                const updateHabit = await db.query("UPDATE habit SET currfreq = $1 WHERE habit_id = $2 RETURNING *;", [currFreq.rows[0].count, habit_id])
                
                const getUser = await db.query("SELECT user_id FROM user_table WHERE username = $1", [user_id])

                const data = await db.query("SELECT * FROM habit WHERE user_id = $1 ORDER BY habit_id DESC", [parseInt(getUser.rows[0].user_id)])
                
                resolve(data)
                
                
            } catch (error) {
                reject(`Could not get habit`);
            }
        })
    }

    static createHabitEntry(data) {
        return new Promise(async (resolve, reject) => {
          try {
            const habitMaxCounter = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = ${data.habit_id} AND time_done::DATE = current_date `)
            const habitFrequency = await db.query(`SELECT frequency FROM habit WHERE habit_id = ${data.habit_id}`)
            if (habitMaxCounter.rows[0].count < habitFrequency.rows[0].frequency) {
                const updateHabit = await db.query("UPDATE habit SET currfreq = $1 WHERE habit_id = $2 RETURNING *;", [parseInt(habitMaxCounter.rows[0].count) + 1, data.habit_id])
                const insertHabitCounter = await db.query(`INSERT INTO habit_counter (habit_id, time_done, finished) VALUES (${data.habit_id}, '${data.date}', ${data.finished}) RETURNING *;`);
              
                const newHabitEntry = insertHabitCounter.rows[0];
                resolve(newHabitEntry)
            } else  {
              error('Too many habits')
            } 
          } catch (error) {
            reject(`Could not create a new habit entry! Try again`);
          }
        });
      }
    

    

}