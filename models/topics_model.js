const connection = require("../db/connection")

exports.fetchTopics = () => {
    return connection
        .select('*')
        .from('topics')
        .then(topicRows => {
            return topicRows;
        })
};

exports.addTopic = (newTopic) => {

    if (newTopic.description === undefined) {
        return Promise.reject({ status: 400, msg: 'Please include a description' })
    }

    return connection
        .insert(newTopic)
        .into('topics')
        .returning('*')
        .then(postedTopic => {
            return postedTopic[0];
        })
};