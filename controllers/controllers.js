const { fetchTopics } = require("../models/models")



const getTopics = (req, res, next) => {
    fetchTopics()
}

module.exports = { getTopics }