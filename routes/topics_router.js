const topicsRouter = require('express').Router()
const { getTopics } = require("../controllers/controllers")


topicsRouter.use("/").get(getTopics)




module.exports = topicsRouter