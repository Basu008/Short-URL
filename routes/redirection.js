const express = require("express")
const router = express.Router()
const {originalURL} = require("../app/url")

router.get("/:shortID",originalURL)

module.exports = router