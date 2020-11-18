const usersRouter = require('express').Router();
const { getUsersByUsername } = require('../controllers/users_controller')
const { send405 } = require('../controllers/error_controller')

usersRouter.route("/");

usersRouter.route('/:username')
    .get(getUsersByUsername)
    .all(send405)

module.exports = usersRouter;