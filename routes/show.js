const {Router} = require('express')
const { validationResult, body } = require('express-validator')
const validateShow = require('../middleware/validateShow')
const db = require('../db/db')
const {Show} = require("../models/Show")
validateRatingAndShow = require('../middleware/validateRatingAndShow.js')

//CREATING SHOW ROUTER 
const showRouter = Router()

//---INSTRUCTIONS---
//RETURNING ALL THE SHOWS IN THE DATABASE 
//---LINK---
//localhost:3000/shows
showRouter.get("/shows", async (req, res) => {
    res.status(200).send(await Show.findAll())
})

//---INSTRUCTIONS---
//The Show Router should GET one show from the database using an endpoint.
//---LINK---
//localhost:3000/shows/1 
showRouter.get("/shows/:num", async (req, res) => {
    const show = await Show.findOne({where: {id:req.params.num}})
    //using express-validator
    const errors = validationResult(show)
    if (errors.isEmpty()) {
        res.status(200).send(show)
    } else {
        res.status(400).send("Show not found")
    }
})

//---INSTRUCTIONS---
//The Show Router should get shows of a specific genre using an endpoint.
//---LINK---
//localhost:3000/shows/genres/Drama
showRouter.get("/shows/genres/:genre", async (req,res) => {
    const showsGenre = await Show.findAll({where: {genre: req.params.genre}})
    const errors = validationResult(showsGenre)
    if (errors.isEmpty()) {
        res.status(200).send(showsGenre)
    } else {
        res.status(400).send("Unable to find genre")
    }
})

//---INSTRUCTIONS---
//The Show Router should update a rating on a specific show using an endpoint.
//For example, a PUT request to /shows/4/watched would update the 4th show that has been watched.
//---LINK---
//localhost:3000/shows/2/5 
//THIS WILL CHANGE THE SHOW RATING FOR SHOWN WITH ID 2 TO 5
showRouter.put("/shows/:showNum/:rating", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    if (show) {
        const rating = req.params.rating 
        await show.update(
            {
                rating:rating
            })
        res.status(200).send(show)
    } else {
        res.status(400).send("Unable to update rating")
        console.log(errors)
    }
})

//---INSTRUCTIONS---
//The Show Router should update a show rating passed into the body using an endpoint 
//---LINK---
//http://localhost:3000/shows/1/ratingShow/watched
showRouter.put("/shows/:showNum/ratingShow/watched",
body('rating').notEmpty().withMessage("Rating cannot be left blank").custom(value => !/\s/.test(value)).withMessage("Rating cannot contain whitespace"), 
validateRatingAndShow,
async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})   
    const rating = req.body.rating 

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(errors)
    }
    
    if(show) {
        await show.update({
            rating: req.body.rating
        })
        res.status(200).send(`The show ${show.title} has been updated with a rating of ${rating}`)
    } else {
        res.status(400).send("Unable to update the rating on this show")
    }
})

//---INSTRUCTIONS---
//The Show Router should update the status on a specific show from “canceled” to “on-going” or vice versa using an endpoint.
//For example, a PUT request with the endpoint /shows/3/updates should be able to update the 3rd show to “canceled” or “on-going”.
//---LINK---
//localhost:3000/shows/2/updatingShows/updates
showRouter.put("/shows/:showNum/updatingShow/updates", 
body('status').notEmpty().withMessage("Status cannot be left blank").isLength({min:5, max:25}).custom(value => !/\s/.test(value)).withMessage("Status cannot contain whitespace"), 
async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    if (req.body.status === "watched" || req.body.status === "on-going" || req.body.status === "cancelled" && show) {
        await show.update ({
            status: req.body.status
        })
        res.status(200).send(`The show ${show.title} has been updated with a status of ${req.body.status}`)
    } else {
        res.status(400).send("Invalid update")
    }
})

//---INSTRUCTIONS---
//The Show Router should be able to delete a show
//---LINK--- 
//localhost:3000/shows/1/deletingShow/delete
showRouter.delete("/shows/:showNum/deletingShow/delete", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    if(show) {
        show.destroy()
        res.status(200).send("Successfully deleted the show")
    } 
})


module.exports = showRouter