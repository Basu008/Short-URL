const express = require('express')
const router = express.Router()
const {createUser,loginUser} = require("../app/user")

router.post("/signup",createUser)
router.get("/login",loginUser)

module.exports = router