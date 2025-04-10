const express = require("express")
const router = express.Router()
const {createShortURL, getAllURLs, getURLsCount, deleteURL} = require("../app/url")

router.route("/")
    .get(getAllURLs)
    .post(createShortURL)
router.get("/count",getURLsCount)
router.delete("/:shortID",deleteURL)

module.exports = router