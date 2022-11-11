const {Router} = require('express')
const { validationResult } = require('express-validator')
const db = require('../db/db')
const { Show } = require('../models')
const {User} = require("../models/User")
const showRouter = require('../routes/show')

async function validateRatingAndShow(req,res,next) {
    const id = req.params.showNum
    req.show = await Show.findOne({where: {id:id}})
    const errors = validationResult(req.body.rating)

    //will check if the rating has no errors and is a number
    if (req.show && errors.isEmpty() && (req.body.rating).isNumeric) {
        next()
    } else {
        res.status(400).send("Invalid rating and/or show")
    }
}

module.exports = validateRatingAndShow
