const apiRouter = require('express').Router();

const topicsRouter = require('./topics_router')
const usersRouter = require('./users_router')
const articlesRouter = require('./articles_router')
const commentsRouter = require('./comments_router')
const { send405 } = require('../controllers/error_controller')

// apiRouter.route('/')
//     .all(send405)

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter