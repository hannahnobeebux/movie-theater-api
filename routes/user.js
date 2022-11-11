const {Router} = require('express')
const validateUser = require('../middleware/validateUser')
const { Show } = require('../models/Show')
const {User} = require("../models/User")

//CREATING THE USER ROUTER
const userRouter = Router()

//---INSTRUCTIONS---
//Returning all the users in the database 
//localhost:3000/users
userRouter.get("/users", async (req, res) => {
    res.status(200).send(await User.findAll())
})

//---INSTRUCTIONS---
//The User Router should GET one user from the database using an endpoint.
//localhost:3000/users/1 
userRouter.get("/users/:num", validateUser, async (req, res) => {
    res.status(200).send(`This is the user with id of ${req.params.num}: \n ${JSON.stringify(req.user, null, 2)}`)
})

//---INSTRUCTIONS---
//The user router should GET the shows watched by a user
//localhost:3000/users/2/shows
userRouter.get("/users/:num/shows", validateUser, async (req,res) => {
    const shows = await req.user.getShows()
    res.status(200).send(`These are the show(s) that the user with id of ${req.params.num} has watched \n ${JSON.stringify(shows, null, 2)}`)
})

//---INSTRUCTIONS---
// The User Router should update and add a show if a user has watched it using an endpoint.
// For example, a PUT request to  /users/2/shows/9 should update the 9th show for the 2nd user.
//--LINK -- 
//localhost:3000/users/2/shows/9
userRouter.put("/users/:num/shows/:showNum", validateUser, async (req,res) => {
    const user = await User.findByPk(req.params.num)
    const show = await Show.findByPk(req.params.showNum)

    const newShow = await show.update({
        userId: req.params.num
    })

    res.status(200).send(`The show with id of ${req.params.showNum} has been added to the user with id of ${req.params.num} \n ${JSON.stringify(newShow, null, 2)}`)

})



module.exports = userRouter;