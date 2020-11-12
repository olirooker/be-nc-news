const connection = require("../db/connection")

exports.fetchUsersByUsername = (username) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', username)
        .then(userRows => {
            if (userRows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found!' })
            }
            else return userRows;
        })
};