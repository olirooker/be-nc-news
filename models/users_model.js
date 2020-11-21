const connection = require("../db/connection");

exports.fetchUsersByUsername = (username) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', username)
        .then(userRows => {
            if (userRows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found!' })
            }
            else return userRows[0];
        })
};

exports.fetchUsers = () => {
    return connection
        .select('*')
        .from('users')
        .then(usersRows => {
            return usersRows;
        })
};

exports.postUser = (newUser) => {
    if (newUser.name === undefined || newUser.avatar_url === undefined) {
        return Promise.reject({ status: 400, msg: 'Missing information on the request' });
    };

    const formattedUser = {
        username: newUser.username,
        name: newUser.name,
        avatar_url: newUser.avatar_url
    };

    return connection
        .insert(formattedUser)
        .into('users')
        .returning('*')
        .then(postedUser => {
            return postedUser[0];
        });
};