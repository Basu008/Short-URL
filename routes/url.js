const express = require("express")
const router = express.Router()
const {createShortURL, getAllURLs} = require("../app/url")

router.route("/")
    .get(getAllURLs)
    .post(createShortURL)

module.exports = router