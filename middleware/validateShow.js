const {Router} = require('express')
const { validationResult } = require('express-validator')
const db = require('../db/db')
const {Show} = require("../models/Show")
const showRouter = require('../routes/show')

function validateUser(req,res,next) {
    const showId = req.params.id
    req.show = Show.findOne({where: {id:showId}})

    if(req.show) {
        res.sendStatus(200)
        next()
    } else {
        res.sendStatus(400)
    }
}

module.exports = validateUser