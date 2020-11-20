const topicsRouter = require('express').Router()
const { getTopics, postTopic } = require("../controllers/topics_controllers")
const { send405 } = require('../controllers/error_controller')

topicsRouter.route("/")
    .get(getTopics)
    .post(postTopic)
    .all(send405)

module.exports = topicsRouter