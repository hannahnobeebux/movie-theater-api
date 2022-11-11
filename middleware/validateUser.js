const {Router} = require('express')
const { validationResult } = require('express-validator')
const db = require('../db/db')
const {User} = require("../models/User")
const userRouter = require('../routes/user')

async function validateUser (req,res,next) {
    const id = req.params.num 
    req.user = await User.findOne({where: {id:id}})

    if(req.user){
        // res.sendStatus(200)
        next()
    } else {
        res.status(400).send(`The user with id of ${id} is not valid`)
    }
}

module.exports = validateUser