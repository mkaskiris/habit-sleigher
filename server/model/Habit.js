const db = require('../db/db.js');

module.exports = class Habit {
    constructor(data) {
        this.habit_id = data.habit_id,
        this.habit = data.habit,
        this.user_id = data.user_id,
        this.streak = 0,
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
    
    //gets habits by username
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

    //gets habit history
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
                reject(err)
            }
        })
    }

    //creates new habit
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
                const user_id = await db.query("SELECT user_id FROM user_table WHERE username = $1", [username])
                const userHabitId = await db.query(`SELECT habit_id FROM habit WHERE user_id = $1;`, [user_id.rows[0].user_id]);
                
                //userHabitId.rows[0].habit_id to access each id
                for(let habitId of userHabitId.rows){
                    const completion = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date;`,[habitId.habit_id]);
                   
                    //completion.rows[0].count to get the count
                    const habits = await db.query("SELECT COUNT(time_done::DATE) FROM habit_counter WHERE habit_id = $1 GROUP BY time_done::DATE ORDER BY time_done::DATE DESC;", [habitId.habit_id])
                    const freq = await db.query("SELECT frequency FROM habit WHERE habit_id = $1;", [habitId.habit_id])
                    let streak = 0;
                    for (let count of habits.rows) {
                        
                        if (count.count == freq.rows[0].frequency) {
                            streak++;
                            await db.query(`UPDATE habit SET currstreak = $1 WHERE habit_id = $2;`,[streak, habitId.habit_id]);

                        } else {
                            break;
                        }
                    }
                    await db.query(`UPDATE habit SET currfreq = $1 WHERE habit_id = $2;`,[completion.rows[0].count, habitId.habit_id]);

                }
                const getHabits = await db.query(`SELECT * FROM habit WHERE user_id = $1 ORDER BY user_id DESC;`,[user_id.rows[0].user_id]);
                resolve(getHabits)
                
                
                
            } catch (error) {
                reject(`Could not get habit`);
            }
        })
    }

    static newHabitEntry(data) {
        return new Promise(async (resolve, reject) => {
          try {
            const maxFreq = await db.query(`SELECT frequency FROM habit WHERE habit_id=$1;`,[data.habit_id]);
            await db.query(`INSERT INTO habit_counter (habit_id, completedstreak) VALUES ($1, FALSE);`,[data.habit_id]);
            const numOfEntries = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE time_done::DATE = current_date AND habit_id= $1;`,[data.habit_id]);
            //check if its the first entry of the day
            console.log(numOfEntries.rows[0].count == 1)
            if(numOfEntries.rows[0].count == 1){
                //check previous day for streak
                console.log("here")
                const prevDay = await db.query(`SELECT COUNT(*) FROM habit_counter WHERE time_done::DATE = current_date - 1 AND habit_id= $1;`,[data.habit_id]);
                if(prevDay.rows[0].count != maxFreq.rows[0].frequency){ //habit completed on the previous day
                    console.log("in this one")
                    await db.query(`UPDATE habit SET currstreak = 0 WHERE habit_id = $1;`,[data.habit_id]);
                } 
            }
            
            else if(parseInt(numOfEntries.rows[0].count) == parseInt(maxFreq.rows[0].frequency)){
                console.log("in new habit entry")
                await db.query(`UPDATE habit SET currstreak = currstreak WHERE habit_id = $1;`,[data.habit_id]);
                //disable button
            }
            resolve('completion inserted to table')

          } catch (error) {
            reject(`Could not create a new habit entry! Try again`);
          }
        });
      }

    static decrement(habit_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currFreq = await db.query("SELECT currfreq, frequency FROM habit WHERE habit_id = $1;", [habit_id]);

                if (currFreq.rows[0].currfreq == currFreq.rows[0].frequency) {
                    await db.query("UPDATE habit SET currstreak = currstreak - 1 WHERE habit_id = $1;", [habit_id])
                }

                const decrement = await db.query("DELETE FROM habit_counter WHERE id IN ( SELECT id FROM habit_counter WHERE habit_id = $1 AND time_done::DATE = current_date ORDER BY time_done desc LIMIT 1 );", [habit_id])
                const rowCounter = decrement.rowCount;

                if (rowCounter > 0) { 
                    resolve(`${habit_id} was decremented!`) 
                }
                else { 
                    resolve(`${habit_id} could not be decremented!`) 
                }
            } catch (error) {
                reject("cannot decrement the counter, try again")
            }
        })
    }
    

    

}