const usersRouter = require('express').Router();
const { getUsersByUsername, getUsers, postUser } = require('../controllers/users_controller')
const { send405 } = require('../controllers/error_controller')

usersRouter.route('/')
    .get(getUsers)
    .post(postUser)

usersRouter.route('/:username')
    .get(getUsersByUsername)
    .all(send405)

module.exports = usersRouter;