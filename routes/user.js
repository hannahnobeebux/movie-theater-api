const {Router} = require('express')
const validateUser = require('../middleware/validateUser')
const { Show } = require('../models/Show')
const {User} = require("../models/User")



const userRouter = Router()

userRouter.get("/users", async (req, res) => {
    res.status(200).send(await User.findAll())
})

//The User Router should GET one user from the database using an endpoint.
//For example, /users/1 should return the first user.
userRouter.get("/users/:num", validateUser, async (req, res) => {
    // const user = await User.findOne({where: {id:req.params.num}})
    // if (user) {
    //     res.status(200).send(`${{user}}`)
    // } else {
    //     res.status(400).send("User not found")
    // }
    res.status(200).send(`This is the user with id of ${req.params.num}: \n ${JSON.stringify(req.user, null, 2)}`)
    // res.status(200).send(`${req.user}`)
})

//The user router should GET the shows watched by a user

userRouter.get("/users/:num/shows", validateUser, async (req,res) => {
    // const user = await User.findOne({where: {id : req.params.num} })
    // if (user) {
    //     const shows = await Show.findAll({where: {userId: user.id}})
    //     res.send(shows)
    // } else {
    //     res.status(400).send("No user/shows found")
    // }
    const shows = await req.user.getShows()
    // res.send(shows)

    res.status(200).send(`These are the show(s) that the user with id of ${req.params.num} has watched \n ${JSON.stringify(shows, null, 2)}`)
})

// The User Router should update and add a show if a user has watched it using an endpoint.
// For example, a PUT request to  /users/2/shows/9 should update the 9th show for the 2nd user.

userRouter.put("/users/:num/shows/:showNum", validateUser, async (req,res) => {
    // const user = await User.findOne({where: {id:req.params.num}})
    const user = await User.findByPk(req.params.num)
    const show = await Show.findByPk(req.params.showNum)

    const newShow = await show.update({
        userId: req.params.num
    })


    res.status(200).send(`The show with id of ${req.params.showNum} has been added to the user with id of ${req.params.num} \n ${JSON.stringify(newShow, null, 2)}`)

    // if (user) {
    //     await show.update({
    //         userId: req.params.num
    //     })
    //     res.status(200).send("Succesfully added user has watched show")
    // } else {
    //     res.status(400).send("User has not watched this show")
    // }


    // if (user) {
    //     await user.addShow(req.params.showNum)
    //     res.status(200).send(user)
    // } else { 
    //     res.status(400).send("Unable to find user")
    // }

     // userRouter.put("/users/:num/shows/:showNum", async (req,res) => {
    //     const user = await User.findOne({where: {id : req.params.num} })
    //     //all the shows related to the user
    //     const shows = await user.getShows()
    //     await Show.update(shows[req.params.showNum])
    // })

})



module.exports = userRouter;