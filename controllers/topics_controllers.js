const { fetchTopics, addTopic } = require("../models/topics_model")

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics });
    })
        .catch(next)
};

exports.postTopic = (req, res, next) => {
    const newTopic = req.body
    addTopic(newTopic).then(postedTopic => {
        res.status(201).send({ postedTopic })
    })
        .catch(next)
};