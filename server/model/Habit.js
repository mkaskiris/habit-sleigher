const db = require('../db/db.js');

module.exports = class Habit {
    constructor(data) {
        this.habit_id = data.habit_id,
        this.habit = data.habit,
        this.user_id = data.user_id
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
    static getByUsername(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const allHabits = await db.query("SELECT * FROM habit INNER JOIN user_table ON (habit.user_id = user_table.user_id) AND (user_table.username = $1) ORDER BY habit_id DESC;", [username]);
                let habits = allHabits.rows.map(r => new Habit(r))
                resolve(habits)
            } catch (err) {
                reject("Error getting name: ", err)
            }
        })
    }

    // static getOldHabits(id) {
    //     return new Promise (async (resolve, reject) => { 
    //         try {
    //             const arr = []
               
    //             const dayBefore = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 1;`, [id]);
    //             const dayBefore2 = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 2;`, [id]);
    //             const dayBefore3 = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 3;`, [id]);
                
    //             arr.push(parseInt(dayBefore.rows[0].count))
    //             arr.push(parseInt(dayBefore2.rows[0].count))
    //             arr.push(parseInt(dayBefore3.rows[0].count))
    //             resolve(arr)

    //         } catch(err) {
    //             reject("Error getting old habits: ", err)
    //         }
    //     })
    // }

    static getOldHabits(id) {
        return new Promise (async (resolve, reject) => { 
            try {
                const arr = []
               
                const days = await db.query("SELECT date_trunc('day', now() - currTime::date) FROM habit WHERE habit_id = $1", [id]);

                let difference = days.rows[0].date_trunc.days;

                const dayBefore = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 1;`, [id]);
                const dayBefore2 = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 2;`, [id]);
                const dayBefore3 = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 3;`, [id]);
                
                if (difference == undefined) {
                    
                    resolve(arr);
                } else if (difference == 1) {
                    arr.push(parseInt(dayBefore.rows[0].count))
                  
                    resolve(arr)
                } else if (difference == 2) {
                    arr.push(parseInt(dayBefore.rows[0].count))
                    arr.push(parseInt(dayBefore2.rows[0].count))
                 
                    resolve(arr)
                } else if (difference == 3) {
                    arr.push(parseInt(dayBefore.rows[0].count))
                    arr.push(parseInt(dayBefore2.rows[0].count))
                    arr.push(parseInt(dayBefore3.rows[0].count))
                   
                    resolve(arr)
                }
                

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
                
                const newHabit = await db.query("INSERT INTO habit (habit, currFreq, frequency, user_id) VALUES ($1, $2, $3, $4) RETURNING *;", [habit, 0, frequency, getUser.rows[0].user_id])
                let habit1 = new Habit(newHabit.rows[0]);
                resolve(habit1)
        
            } catch(err) {
                reject("Error creating habit: ", err)
            }
        })

    }

    //increments streak in habit table
    static updateStreak(habit_id) {
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

    //still in progress
    static getHabits(habit_id, username) {
        return new Promise(async (resolve, reject) => {
            try {
                const currFreq = await db.query("SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date", [habit_id]);
                await db.query("UPDATE habit SET currfreq = $1 WHERE habit_id = $2", [currFreq.rows[0].count, habit_id])

                const getYesterdayStreak = await db.query("SELECT DISTINCT(time_done::DATE), SUM(CASE WHEN completedstreak = TRUE THEN 1 ELSE 0 END) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date - 1 GROUP BY time_done;", [habit_id])
                const getTodaysStreak = await db.query("SELECT DISTINCT(time_done::DATE), SUM(CASE WHEN completedstreak = TRUE THEN 1 ELSE 0 END) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date GROUP BY time_done;", [habit_id])
            
        
                const findHabitId = await db.query("SELECT * FROM habit WHERE habit_id = $1", [habit_id])
                if (findHabitId.rows.length) {
                    if (getYesterdayStreak.rows.length < 1) {
                        if (getTodaysStreak.rows.length < 1) {
                            await db.query("UPDATE habit SET currstreak = 0 WHERE habit_id = $1", [habit_id])
                        }
                    }

                    if (parseInt(getYesterdayStreak.rows[getYesterdayStreak.rows.length - 1].sum) == 1) {
                        if (getTodaysStreak.rows.length < 1 || getTodaysStreak.rows[getTodaysStreak.rows.length - 1].sum == '0') {
                            await db.query("UPDATE habit SET currstreak = $1 WHERE habit_id = $2", [getYesterdayStreak.rows[getYesterdayStreak.rows.length - 1].sum, habit_id]);
                        }
                    }

                    if (getTodaysStreak.rows.length) {
                        if (parseInt(getTodaysStreak.rows[getTodaysStreak.rows.length - 1].sum) == 1) {
                            await db.query("UPDATE habit SET currstreak = $1 WHERE habit_id = $2", [parseInt(getYesterdayStreak.rows[getYesterdayStreak.rows.length - 1].sum) + parseInt(getTodaysStreak.rows[1].sum), habit_id]);
                        }
                    }
                }

                const getUser = await db.query("SELECT user_id FROM user_table WHERE username = $1;", [username])
                const data = await db.query("SELECT * FROM habit WHERE user_id = $1 ORDER BY habit_id DESC;", [parseInt(getUser.rows[0].user_id)])
                
                resolve(data)
                
                
                
            } catch (error) {
                reject(`Could not get habit`);
            }
        })
    }

    static newHabitEntry(data) {
        return new Promise(async (resolve, reject) => {
          try {
            const habitMaxCounter = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = ${data.habit_id} AND time_done::DATE = current_date `)
            const habitFrequency = await db.query(`SELECT frequency FROM habit WHERE habit_id = ${data.habit_id}`)
            if (parseInt(habitMaxCounter.rows[0].count) + 1 < parseInt(habitFrequency.rows[0].frequency)) {
                const updateHabit = await db.query("UPDATE habit SET currfreq = $1 WHERE habit_id = $2 RETURNING *;", [parseInt(habitMaxCounter.rows[0].count) + 1, data.habit_id])
                const insertHabitCounter = await db.query(`INSERT INTO habit_counter (habit_id, time_done, completedStreak) VALUES (${data.habit_id}, '${data.date}', FALSE) RETURNING *;`);

                const newHabitEntry = insertHabitCounter.rows[0];
                resolve(newHabitEntry)
            } 
            else if (parseInt(habitMaxCounter.rows[0].count) + 1 == parseInt(habitFrequency.rows[0].frequency))  {
                const insertHabitCounter = await db.query(`INSERT INTO habit_counter (habit_id, time_done, completedStreak) VALUES (${data.habit_id}, '${data.date}', TRUE) RETURNING *;`);
                const newHabitEntry = insertHabitCounter.rows[0];
                resolve(newHabitEntry)
            } 
          } catch (error) {
            reject(`Could not create a new habit entry! Try again`);
          }
        });
      }
    

    

}