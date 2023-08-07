const authRoute = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utils/tokens")

authRoute.post("/register", async (req, res) => {
  console.log(req.body)
  try{
    const user = await User.register(req.body)
    const token = generateToken(user)
    res.status(200).send({user, token})
  }catch(error){
    console.error(error.message.red)
    // if email has already been used to register
    if(error.code === '23505'){
      error.message = "email has already been used"
    }
    res.status(error.statusCode || 401).send({message: error.message})
  }
})

authRoute.post("/login", async (req, res) => {
  try{
    const user = await User.login(req.body)
    const token = generateToken(user)
    res.status(200).send({user, token})
  }catch(error){
    console.error(error.message.red)
    res.status(error.statusCode).send({message: error.message})
  }
})

module.exports = authRoute

