const express = require("express")
const router = express.Router()
const {createShortURL, originalLink, linkAnalytics, getAllLinks} = require("../app/url")

//To shorten the link
router.post("/",createShortURL)
router.get("/",getAllLinks)
router.get("/:shortID",originalLink)
router.get("/analytics/:shortID",linkAnalytics)

module.exports = router