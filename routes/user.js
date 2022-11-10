const {Router} = require('express')
const { Show } = require('../models/Show')
const {User} = require("../models/User")

const userRouter = Router()

userRouter.get("/users", async (req, res) => {
    res.status(200).send(await User.findAll())
})

//The User Router should GET one user from the database using an endpoint.
//For example, /users/1 should return the first user.
userRouter.get("/users/:num", async (req, res) => {
    const user = await User.findOne({where: {id:req.params.num}})
    if (user) {
        res.status(200).send(user)
    } else {
        res.status(400).send("User not found")
    }
})

userRouter.get("/users/:num/shows", async (req,res) => {
    const user = await User.findOne({where: {id : req.params.num} })
    if (user) {
        const shows = await Show.findAll({where: {userId: user.id}})
        res.send(shows)
    } else {
        res.status(400).send("No user/shows found")
    }
    // const shows = await user.getShows()
    // res.send(shows)
})

// The User Router should update and add a show if a user has watched it using an endpoint.
// For example, a PUT request to  /users/2/shows/9 should update the 9th show for the 2nd user.
    // userRouter.put("/users/:num/shows/:showNum", async (req,res) => {
    //     const user = await User.findOne({where: {id : req.params.num} })
    //     //all the shows related to the user
    //     const shows = await user.getShows()
    //     await Show.update(shows[req.params.showNum])
    // })

userRouter.put("users/:num/shows/showNum", async (req,res) => {
    const user = await User.findOne({where: {id:req.params.num}})
    if (user) {
        await user.addShow(req.params.showNum)
        res.status(200).send(user)
    } else { 
        res.status(400).send("Unable to find user")
    }
    
    
})



module.exports = userRouter;