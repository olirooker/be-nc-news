const { fetchArticleById, updateArticleVotesById } = require('../models/articles_model')

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    fetchArticleById(articleId).then(article => {
        res.status(200).send({ article })
    })
        .catch(next)
};

exports.patchArticleVotesById = (req, res, next) => {
    const articleId = req.params.article_id;
    const voteChange = req.body;

    updateArticleVotesById(articleId, voteChange).then(article => {
        res.status(201).send({ article })
    })
};