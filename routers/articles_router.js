const articlesRouter = require('express').Router();

// require in controller functions
const { getArticleById, patchArticleVotesById, deleteArticleById, getAllArticles } = require('../controllers/articles_controller')
const { getCommentsForArticle, postCommentToArticleById } = require('../controllers/comments_controller')
const { send405 } = require('../controllers/error_controller')

articlesRouter.route('/')
    .get(getAllArticles)
    .all(send405)

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleVotesById)
    .delete(deleteArticleById)
    .all(send405)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsForArticle)
    .post(postCommentToArticleById)
    .all(send405)

module.exports = articlesRouter;