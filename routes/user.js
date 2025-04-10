const express = require('express')
const router = express.Router()
const {updateUser, getUser} = require("../app/user")

router.route("/")
    .get(getUser)
    .patch(updateUser)

module.exports = router
