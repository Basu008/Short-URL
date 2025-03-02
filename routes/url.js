const express = require("express")
const router = express.Router()
const {createShortURL, originalLink, linkAnalytics, getAllLinks} = require("../app/url")

router.post("/",createShortURL)
// router.get("/",getAllLinks)
router.get("/:shortID",originalLink)

// router.get("/count/",getLinkCounts)
// router.get("/visits/:shortID",linkAnalytics)

module.exports = router