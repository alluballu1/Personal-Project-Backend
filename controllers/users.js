const userRouter = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/user")

userRouter.get("/", async (req, res, nxt) => {
    const users = await User.find({}).populate("projects")
    res.json(users.map(user => user.toJSON())).status(200)
})

userRouter.post("/", async (req, res, nxt) => {
    const body = req.body
    if (!body.password || !body.username) {
        return res.status(401).json("Invalid.")
    }
    const salt = 10
    const passwordHash = await bcrypt.hash(body.password, salt)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })
    await user.save().then(result => res.json(result)).catch(err => nxt(err))

})

module.exports = userRouter