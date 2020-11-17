const connection = require("../db/connection");

exports.checkOrderQuery = (query) => {
    return !query || (query === 'asc' || query === 'desc');
};

exports.checkUserExists = (user) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', user)
        .then(username => {
            if (username.length === 0) return false
            else return true
        })
};