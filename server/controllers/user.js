const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../model/User');
require('dotenv').config();

async function index(req, res) {
    try {
        const users = await User.all
        res.status(200).json(users)
    } catch (err) {
        res.status(500).send({ err })
    }
}

async function find (req, res) {
    try {
        const findUser = await User.exists(req.params.name)
            if (!findUser.rows.length) {
                res.status(404).json({msg: 'No user!'})
            } else {
                res.status(201).json({msg: 'User found'})
            }
    
    } catch (err) {
        res.status(500).send({ err: "ERROR FINDING NAMES" })
    }
}

async function register (req, res){

    try {
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(req.body.password, salt)
        await User.register({...req.body, password: hashed})
        res.status(201).json({msg: 'User created'})    
    } catch (err) {
        res.status(500).json({err: "Username or email already exists!"});
    }
}

async function login(req, res){

    try {
        const user = await User.findByEmail(req.body.email)
        if(!user){ throw new Error('No user with this email') }
        const authed = await bcrypt.compare(req.body.password, user.usr_password);
        if (!!authed){
            const payload = { username: user.username, email: user.email }
            const sendToken = (err, token) => {
                if(err) { 
                    throw new Error('Error in token generation') 
                }
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
            jwt.sign(payload, process.env.SECRET, sendToken);
            res.status(200);
        } else {
            throw new Error('User could not be authenticated')  
        }
        
    } catch (err) {
        res.status(401).json({err: "Username or email does not exist!"});
    }
}

module.exports = 
        {
           index,
           register,
           find,
           login
        }