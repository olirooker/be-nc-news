const articlesRouter = require('express').Router();

const { getArticleById } = require('../controllers/articles_controller')

articlesRouter.route('/:article_id')
    .get(getArticleById)

module.exports = articlesRouter;