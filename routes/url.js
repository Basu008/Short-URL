const express = require("express")
const router = express.Router()
const {createShortURL, getAllURLs, getURLsCount} = require("../app/url")

router.route("/")
    .get(getAllURLs)
    .post(createShortURL)
router.get("/count",getURLsCount)

module.exports = router