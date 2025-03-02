const express = require("express")
const router = express.Router()
const {createShortURL, originalURL, linkAnalytics, getAllURLs} = require("../app/url")

router.post("/url",createShortURL)
router.get("/urls",getAllURLs)
router.get("/url/:shortID",originalURL)


module.exports = router