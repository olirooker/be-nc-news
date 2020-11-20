const connection = require("../db/connection");

exports.checkExists = (table, column, query) => {

    if (!query) return true;

    return connection
        .select('*')
        .from(table)
        .where(column, '=', query)
        .then(result => {
            if (result.length === 0) {
                return Promise.reject({ status: 404, msg: `${query}? No articles found!` })
            }
            else return true;
        })
};