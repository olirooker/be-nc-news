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
    return connection
        .insert(newTopic)
        .into('topics')
        .returning('*')
        .then(postedTopic => {
            return postedTopic[0];
        })
};