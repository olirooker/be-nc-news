const commentsRouter = require('express').Router();

const { patchCommentVotesById, deleteCommentById } = require('../controllers/comments_controller')

commentsRouter.route('/:comment_id')
    .patch(patchCommentVotesById)
    .delete(deleteCommentById)

module.exports = commentsRouter;