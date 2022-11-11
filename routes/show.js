const {Router} = require('express')
const { validationResult, body } = require('express-validator')
const validateShow = require('../middleware/validateShow')
const db = require('../db/db')
const {Show} = require("../models/Show")

const showRouter = Router()

showRouter.get("/shows", async (req, res) => {
    res.status(200).send(await Show.findAll())
})

//The Show Router should GET one show from the database using an endpoint.
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

//The Show Router should get shows of a specific genre using an endpoint.
showRouter.get("/shows/genres/:genre", async (req,res) => {
    const showsGenre = await Show.findAll({where: {genre: req.params.genre}})
    const errors = validationResult(showsGenre)
    if (errors.isEmpty()) {
        res.status(200).send(showsGenre)
    } else {
        res.status(400).send("Unable to find genre")
    }
})


//The Show Router should update a rating on a specific show using an endpoint.
//For example, a PUT request to /shows/4/watched would update the 4th show that has been watched.
showRouter.put("/shows/:showNum/:rating", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    // const errors = validationResult(req)
    if (show) {
        const rating = req.params.rating 
        // await show.update({where: {rating:rating}})
        // await (show.rating).update({rating})

        await show.update(
            {
                rating:rating
            }
            // {
            //     where: {id:req.params.num}
            // }
        )

        res.status(200).send(show)
    } else {
        res.status(400).send("Unable to update rating")
        console.log(errors)
    }
})

showRouter.put("/shows/:showNum/ratingShow/watched",
body('rating').notEmpty().withMessage("Rating cannot be left blank").custom(value => !/\s/.test(value)).withMessage("Rating cannot contain whitespace"), 
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

//The Show Router should update the status on a specific show from “canceled” to “on-going” or vice versa using an endpoint.
//For example, a PUT request with the endpoint /shows/3/updates should be able to update the 3rd show to “canceled” or “on-going”.
showRouter.put("/shows/:showNum/updatingShow/updates", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    if (req.body.status === "watched" || req.body.status === "on-going" || req.body.status === "cancelled" && show) {
        await show.update ({
            status: req.body.status
        })
        // , {
        //     where: {d:req.params.showNum}
        // }
        res.status(200).send(`The show ${show.title} has been updated with a status of ${req.body.status}`)
        // const status = req.body.status
        // return res.status(200).send("Valid update")
    } else {
        res.status(400).send("Invalid update")
    }
   
    // if(show) {
    //     await Show.update ({
    //         status: req.body.status
    //     }, {
    //         where: {d:req.params.showNum}
    //     }
    //     )
    //     res.status(200).send(`The show ${show.title} has been updated with a status of ${req.body.status}`)
    // } else {
    //     res.status(400).send("Unable to update the status on this show")
    // }

})

//The Show Router should be able to delete a show
showRouter.delete("/shows/:showNum/deletingShow/delete", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.showNum}})
    if(show) {
        show.destroy()
        res.status(200).send("Successfully deleted the show")
    }
    
})


module.exports = showRouter