const articlesRouter = require('express').Router();

const { getArticleById, patchArticleVotesById } = require('../controllers/articles_controller')

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleVotesById)

module.exports = articlesRouter;