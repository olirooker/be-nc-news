const usersRouter = require('express').Router();
const { getUsersByUsername } = require('../controllers/users_controller')

usersRouter.route("/");

usersRouter.route('/:username')
    .get(getUsersByUsername)

module.exports = usersRouter;