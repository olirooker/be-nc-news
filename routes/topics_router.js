const topicsRouter = require('express').Router()
const { getTopics } = require("../controllers/controllers")


topicsRouter.route("/").get(getTopics)




module.exports = topicsRouter