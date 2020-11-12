const articlesRouter = require('express').Router();

const { getArticleById, patchArticleVotesById, deleteArticleById, getAllArticles } = require('../controllers/articles_controller')

articlesRouter.route('/')
    .get(getAllArticles)

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleVotesById)
    .delete(deleteArticleById)

module.exports = articlesRouter;