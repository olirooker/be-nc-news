const connection = require("../db/connection")


const fetchTopics = () => {
    return connection
        .select('*')
        .from('topics')
        .then(topicRows => {
            return { topics: topicRows }
        })
}


module.exports = { fetchTopics }