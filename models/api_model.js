const connection = require("../db/connection")
const endpoints = require('../endpoints.json')

exports.fetchAllEndpoints = () => {
    return Promise.resolve(endpoints)
};