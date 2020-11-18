const commentsRouter = require('express').Router();

const { patchCommentVotesById, deleteCommentById } = require('../controllers/comments_controller')
const { send405 } = require('../controllers/error_controller')


commentsRouter.route('/:comment_id')
    .patch(patchCommentVotesById)
    .delete(deleteCommentById)
    .all(send405)

module.exports = commentsRouter;