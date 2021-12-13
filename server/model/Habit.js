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
    
    //gets habits by user
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

    static createHabit({habit, frequency, username}) {
        return new Promise (async (resolve, reject) => {
            try {
                const getUser = await db.query("SELECT user_id FROM user_table WHERE username = $1", [username])
              
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
                await db.query("DELETE FROM habit WHERE habit_id = $1;", [id])
                resolve('habit deleted')
            } catch (err) {
                reject("Error deleting habit: ", err)
            }
        })
    }

    static getHabits(habit_id, username) {
        return new Promise(async (resolve, reject) => {
            try {
              
                const maxFreq = await db.query("SELECT frequency FROM habit WHERE habit_id = $1", [habit_id])
                const currFreq = await db.query("SELECT currfreq FROM habit WHERE habit_id = $1", [habit_id])
               
                if (parseInt(currFreq.rows[0].currfreq) + 1 === parseInt(maxFreq.rows[0].frequency)) {
                    await db.query("UPDATE habit SET currstreak = currstreak + 1 WHERE habit_id = $1", [habit_id]);
                }
                
                resolve(habit_id)

            } catch (error) {
                reject(`Could not append habit`);
            }
        })
    }

    static getHabits(habit_id, user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currFreq = await db.query("SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date", [habit_id]);
                await db.query("UPDATE habit SET currfreq = $1 WHERE habit_id = $2", [currFreq.rows[0].count, habit_id])
    
                const currStreak = await db.query("SELECT currstreak FROM habit WHERE habit_id = $1;", [habit_id]);
                const maxStreak = await db.query("SELECT maxstreak FROM habit WHERE habit_id = $1;", [habit_id]);

                const allLists = await db.query("SELECT DATE(time_done), COUNT(habit_id) FROM habit_counter WHERE habit_id = $1 AND DATE(time_done) != current_date GROUP BY CAST(time_done AS DATE);", [habit_id])
                const maxFreq = await db.query("SELECT frequency FROM habit WHERE habit_id = $1", [habit_id])
                const newArray= allLists.rows.map(element => element.count);
                
<<<<<<< HEAD
                let count = 0;
                for (let i = 0; i < newArray.length; i++) {
                    if (parseInt(newArray[i]) === parseInt(maxFreq.rows[0].frequency)) {
                        count += 1;
                        await db.query(`UPDATE habit SET currstreak = ${count} WHERE habit_id = $1`, [habit_id])
                    }
                }
                if (parseInt(currFreq.rows[0].count) === parseInt(maxFreq.rows[0].frequency)) {
                    await db.query("UPDATE habit SET currstreak = currstreak + 1 WHERE habit_id = $1", [habit_id]);
                }

                if (currStreak.rows[0].currstreak >= maxStreak.rows[0].maxstreak) {
                    let changed = await db.query("UPDATE habit SET maxstreak = $1 WHERE habit_id = $2", [currStreak.rows[0].currstreak, habit_id]);
                    console.log(changed, habit_id)
                }

                const getUser = await db.query("SELECT user_id FROM user_table WHERE username = $1", [user_id])
    
                const data = await db.query("SELECT * FROM habit WHERE user_id = $1 ORDER BY habit_id DESC", [parseInt(getUser.rows[0].user_id)])
=======
                const getUser = await db.query("SELECT user_id FROM user_table WHERE username = $1;", [username])

                const data = await db.query("SELECT * FROM habit WHERE user_id = $1 ORDER BY habit_id DESC;", [parseInt(getUser.rows[0].user_id)])
>>>>>>> 517cde308ba9935356862757edbeb22b59671578
                
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
<<<<<<< HEAD
                const updateHabit = await db.query("UPDATE habit SET currfreq = $1 WHERE habit_id = $2 RETURNING *;", [parseInt(habitMaxCounter.rows[0].count) + 1, data.habit_id])
                const insertHabitCounter = await db.query(`INSERT INTO habit_counter (habit_id, time_done) VALUES (${data.habit_id}, '${data.date}') RETURNING *;`);

=======
                await db.query("UPDATE habit SET currfreq = $1 WHERE habit_id = $2;", [parseInt(habitMaxCounter.rows[0].count) + 1, data.habit_id])
                const insertHabitCounter = await db.query(`INSERT INTO habit_counter (habit_id, time_done, finished) VALUES (${data.habit_id}, '${data.date}', ${data.finished}) RETURNING *;`);
              
>>>>>>> 517cde308ba9935356862757edbeb22b59671578
                const newHabitEntry = insertHabitCounter.rows[0];
                resolve(newHabitEntry)
            } else  {
              throw new Error('Too many habits')
            } 
          } catch (error) {
                reject(`Could not create a new habit entry! Try again: ${error}`);
          }
        });
      }
    

    

}