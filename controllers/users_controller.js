const { fetchUsersByUsername } = require('../models/users_model')

exports.getUsersByUsername = (req, res, next) => {
    const username = req.params.username;
    fetchUsersByUsername(username).then(user => {
        res.status(200).send({ user })
    })
        .catch(next)
};