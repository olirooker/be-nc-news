const connection = require("../db/connection")

exports.fetchUsersByUsername = (username) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', username)
        .then(userRows => {
            return userRows;
        })
};