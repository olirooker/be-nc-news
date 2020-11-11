const { fetchTopics } = require("../models/topics_model")

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics });
    })
        .catch(next)
};