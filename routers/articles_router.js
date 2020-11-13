const articlesRouter = require('express').Router();

// require in controller functions
const { getArticleById, patchArticleVotesById, deleteArticleById, getAllArticles } = require('../controllers/articles_controller')
const { getCommentsForArticle, postCommentToArticleById } = require('../controllers/comments_controller')


articlesRouter.route('/')
    .get(getAllArticles)

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleVotesById)
    .delete(deleteArticleById)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsForArticle)
    .post(postCommentToArticleById)

module.exports = articlesRouter;