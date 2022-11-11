const express = require ('express')
const {body, validationResult} = require('express')

const userRouter = require("./routes/user");
const showRouter = require("./routes/show")

const {db} = require("./db/db");

const app = express()
app.use(express.json());

const seed = require('./seed.js')

app.get("/sync", async (req,res) => {
    res.sendStatus(200)
})

app.use("/", userRouter)

app.use("/", showRouter)

app.listen(3000, async () => {
    // await db.sync()
    //everytime the server is rerun the tables+db is dropped and recreated 

    //this will delete and create the data each time the file is saved 
    await seed()
    console.log("Listening on port 3000")
})

module.exports = app;