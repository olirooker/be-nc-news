const { fetchTopics } = require("../models/models")



const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics);
    })
}

module.exports = { getTopics }