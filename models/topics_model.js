const connection = require("../db/connection")

exports.fetchTopics = () => {
    return connection
        .select('*')
        .from('topics')
        .then(topicRows => {
            return topicRows;
        })
}
