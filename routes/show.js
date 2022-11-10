const {Router} = require('express')
const db = require('../db/db')
const {Show} = require("../models/Show")

const showRouter = Router()

showRouter.get("/shows", async (req, res) => {
    res.status(200).send(await Show.findAll())
})

//The Show Router should GET one show from the database using an endpoint.
showRouter.get("/shows/:num", async (req, res) => {
    const show = await Show.findOne({where: {id:req.params.num}})
    if (show) {
        res.status(200).send(show)
    } else {
        res.status(400).send("Show not found")
    }
})

//The Show Router should get shows of a specific genre using an endpoint.
showRouter.get("/shows/genres/:genre", async (req,res) => {
    const showsGenre = await Show.findAll({where: {genre: req.params.genre}})
    if (showsGenre) {
        res.status(200).send(showsGenre)
    } else {
        res.status(400).send("Unable to find genre")
    }
})


//The Show Router should update a rating on a specific show using an endpoint.
//For example, a PUT request to /shows/4/watched would update the 4th show that has been watched.
showRouter.put("/shows/:num/:rating", async (req,res) => {
    const show = await Show.findOne({where: {id:req.params.num}})
    if (show) {
        const rating = req.params.rating 
        // await show.update({where: {rating:rating}})
        // await (show.rating).update({rating})

        await Show.update(
            {
                rating:rating
            }, 
            {
                where: {id:req.params.num}
            }
        )

        res.status(200).send(show)
    } else {
        res.status(400).send("Unable to update rating")
    }
})

module.exports = showRouter