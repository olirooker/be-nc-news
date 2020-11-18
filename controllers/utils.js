const connection = require("../db/connection");

exports.checkOrderQuery = (query) => {
    return !query || (query === 'asc' || query === 'desc');
};