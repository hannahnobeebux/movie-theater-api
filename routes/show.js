const {Router} = require('express')
const { validationResult, body } = require('express-validator')
const validateShow = require('../middleware/validateShow')
const db = require('../db/db')
const {Show} = require("../models/Show")
validateRatingAndShow = require('../middleware/validateRatingAndShow.js')

//TESTING 
//1 GET - localhost:3000/shows (return all)
//2 GET - localhost:3000/shows/6 (finding a specific show)
//3 GET - localhost:3000/shows/title/X-Files (finding a specific show)
//4 GET - localhost:3000/shows/genres/Sitcom (finding a specific genre)
//5 PUT - localhost:3000/shows/11/3.5 (changing the rating of the 11th show to "3.5")
//6 PUT - localhost:3000/shows/5/ratingShow/watched (will change the rating of the 5th show to whatever integer/float is passed in the body)
//7 PUT - localhost:3000/shows/6/updatingShows/updates (will change the status of the 6th show to whatever *valid status is passed in the body)
//8 DELETE- localhost:3000/shows/1/deletingShow/delete (will delete the 1st show)


//CREATING SHOW ROUTER 
const showRouter = Router()

//---INSTRUCTIONS---
//RETURNING ALL THE SHOWS IN THE DATABASE 
//---LINK---
//localhost:3000/shows
showRouter.get("/shows", async (req, res) => {
    // res.status(200).send(await Show.findAll())
    const shows = await Show.findAll()
    res.status(200).send(`All shows: \n ${JSON.stringify(shows, null, 2)}`)
})

//---INSTRUCTIONS---
//The Show Router should GET one show from the database using an endpoint. (using ID)
//---LINK---
//localhost:3000/shows/1 
showRouter.get("/shows/:num", async (req, res) => {
    const show = await Show.findOne({where: {id:req.params.num}})
    //using express-validator
    const errors = validationResult(show)
    if (errors.isEmpty()) {
        res.status(200).send(`This is the infomation we have about ${show.title} : \n ${JSON.stringify(show, null, 2)}`)
    } else {
        res.status(400).send("Show not found")
    }
})

//---INSTRUCTIONS---
//The Show Router should GET one show from the database using an endpoint. (using title)
//---LINK---
//localhost:3000/shows/title/Avatar
showRouter.get("/shows/title/:titleName", async (req,res) => {
    // const title = (req.params.titleName).replace("_", " ")
    const show = await Show.findOne({where: {title:req.params.titleName}})

    const errors = validationResult(show)
    if (errors.isEmpty()) {
        res.status(200).send(`This is the infomation we have about ${show.title} : \n ${JSON.stringify(show, null, 2)}`)
    } else {
        res.status(400).send(`${show.title} not found`)
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
        res.status(200).send(`These are all the shows with the genre: ${req.params.genre} \n ${JSON.stringify(showsGenre, null, 2)}`)
    } else {
        res.status(400).send(`Unable to find genre ${req.params.genre}`)
    }
})

//---INSTRUCTIONS---
//The Show Router should update a rating on a specific show using an endpoint.
//For example, a PUT request to /shows/4/watched would update the 4th show that has been watched.
//---LINK---
//localhost:3000/shows/2/5 
//THIS WILL CHANGE THE SHOW RATING FOR SHOW WITH ID 2 TO 5
showRouter.put("/shows/:showNum/:rating", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    if (show) {
        const rating = req.params.rating 
        await show.update(
            {
                rating:rating
            })
        res.status(200).send(`${show.title} has been updated to have a rating of ${show.rating} [via endpoint]`)
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
    // const show = await Show.findOne({where: {id:req.params.showNum}})   
    // const rating = req.body.rating 

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(errors)
    }

    await req.show.update({
        rating: req.body.rating
    })
    res.status(200).send(`The show ${req.show.title} has been updated with a rating of ${req.show.rating} [via body]`)
})

//---INSTRUCTIONS---
//The Show Router should update the status on a specific show from “canceled” to “on-going” or vice versa using an endpoint.
//For example, a PUT request with the endpoint /shows/3/updates should be able to update the 3rd show to “canceled” or “on-going”.
//---LINK---
//localhost:3000/shows/2/updatingShows/updates

showRouter.put("/shows/:showNum/updatingShows/updates", 
body('status').notEmpty().withMessage("Status cannot be left blank").isLength({min:5, max:25}).withMessage("Must be between 5 and 25 characters").custom(value => !/\s/.test(value)).withMessage("Status cannot contain whitespace"), 
async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    const errors = validationResult(show)
    if ((req.body.status === "watched" || req.body.status === "on-going" || req.body.status === "cancelled" || req.body.status === "watching")) {
        await show.update ({
            status: req.body.status
        })
        return res.status(200).send(`The show ${show.title} has been updated with a status of ${req.body.status} [via body]`)
    } else {
        res.status(400).send("Invalid update, please try again")
    }
    console.log(errors)
})

//---INSTRUCTIONS---
//The Show Router should be able to delete a show
//---LINK--- 
//localhost:3000/shows/1/deletingShow/delete
showRouter.delete("/shows/:showNum/deletingShow/delete", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    if(show) {
        show.destroy()
        res.status(200).send(`Successfully deleted ${show.title}`)
    } else {
        res.status(400).send("Cannot find show")
    }
})


module.exports = showRouter