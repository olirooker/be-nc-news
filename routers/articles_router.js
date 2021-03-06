const articlesRouter = require('express').Router();
const { getArticleById, patchArticleVotesById, deleteArticleById, getAllArticles, postArticle } = require('../controllers/articles_controller')
const { getCommentsForArticle, postCommentToArticleById } = require('../controllers/comments_controller')
const { send405 } = require('../controllers/error_controller')

articlesRouter.route('/')
    .get(getAllArticles)
    .post(postArticle)
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