const { fetchArticleById } = require('../models/articles_model')

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    fetchArticleById(articleId).then(article => {
        res.status(200).send({ article })
    })
        .catch(next)
}