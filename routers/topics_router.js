const topicsRouter = require('express').Router()
const { getTopics } = require("../controllers/topics_controllers")

topicsRouter.route("/")
    .get(getTopics)

module.exports = topicsRouter