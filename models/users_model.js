const connection = require("../db/connection")

exports.fetchUsersByUsername = (username) => {

    // check if i need this if statement

    // if (username === undefined) {
    //     return Promise.resolve([])
    // } else {
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
    // }

    // moved into the if/else statement

    // return connection
    //     .select('*')
    //     .from('users')
    //     .where('username', '=', username)
    //     .then(userRows => {
    //         if (userRows.length === 0) {
    //             return Promise.reject({ status: 404, msg: 'User not found!' })
    //         }
    //         else return userRows;
    //     })
};