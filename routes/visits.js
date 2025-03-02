const express = require("express")
const router = express.Router()
const {getVisits, getURLVisits, getVisitsCount, getURLVisitsCount} = require("../app/visit")

router.get("/",getVisits)
router.get("/url/:shortID",getURLVisits)
router.get("/count",getVisitsCount)
router.get("/count/:shortID",getURLVisitsCount)

module.exports = router