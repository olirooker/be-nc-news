const { fetchAllEndpoints } = require("../models/api_model");


exports.getAllEndpoints = (req, res, next) => {
    fetchAllEndpoints().then(endpoints => {
        res.status(200).send({ endpoints })
    })
        .catch(next)
};