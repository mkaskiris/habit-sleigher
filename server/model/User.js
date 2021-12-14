const db = require('../db/db.js');

module.exports = class User {
    constructor(data) {
        this.user_id = data.user_id,
        this.username = data.username,
        this.email = data.email,
        this.usr_password = data.usr_password
    }

    static get all() {
        return new Promise (async (resolve, reject) => {
            try {
                const allUsers = await db.query("SELECT * FROM user_table");
                // res.json(allUsers.rows)
                let user = allUsers.rows.map(user => new User(user));
                resolve(user)
            } catch (err) {
                reject(`User not found! ${err}`)
            }
        })
    }

    static getUser(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const getSpecificUser = await db.query("SELECT * FROM user_table WHERE username = $1", [name])
                resolve(getSpecificUser)

            } catch (err) {
                reject(`User not found! ${err}`)
            }
        })
    }

    static exists(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.query("SELECT * FROM user_table WHERE username = $1", [name])
                resolve(user)
            } catch (err) {
                reject(err, ": Cannot find if user exists or not")
            }
        })
    }

   static register({ username, email, password }) {
       return new Promise(async (resolve, reject) => {
            try {
                const findUser = await db.query(`SELECT * FROM user_table WHERE username = '${username}'`)
                const findEmail = await db.query(`SELECT * FROM user_table WHERE email = '${email}'`)

                if (!findUser.rows.length && !findEmail.rows.length) {
                    const newUser = await db.query(`INSERT INTO user_table (username, email, usr_password) VALUES ('${username}', '${email}', '${password}') RETURNING *;`)
                    let user = new User(newUser.rows[0]);
                    resolve(user)
                } else {
                    reject('User already exists!')  
                }
               
            
            } catch (err) {
                reject(`Error creating user: ${err}`)
            }
        })
       
   }

   static findByEmail(email) {
        return new Promise(async (res, rej) => {
            try {
                let result = await db.query(`SELECT * FROM user_table WHERE email = '${email}';`);
                let user = new User(result.rows[0])
                res(user)
            } catch (err) {
                rej(`Error retrieving user: ${err}`)
            }
        })
    }
   
}