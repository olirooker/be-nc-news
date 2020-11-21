const { fetchUsersByUsername, fetchUsers, postUser } = require('../models/users_model')

exports.getUsersByUsername = (req, res, next) => {
    const username = req.params.username;
    fetchUsersByUsername(username).then(user => {
        res.status(200).send({ user })
    })
        .catch(next);
};

exports.getUsers = (req, res, next) => {
    fetchUsers().then(users => {
        res.status(200).send({ users })
    })
        .catch(next);
};

exports.postUser = (req, res, next) => {
    const newUser = req.body
    postUser(newUser).then(postedUser => {
        res.status(201).send({ postedUser });
    })
        .catch(next);
};