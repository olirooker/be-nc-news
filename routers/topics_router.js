const topicsRouter = require('express').Router()
const { getTopics } = require("../controllers/topics_controllers")
const { send405 } = require('../controllers/error_controller')

topicsRouter.route("/")
    .get(getTopics)
    .all(send405)

module.exports = topicsRouter