const { fetchArticleById, updateArticleVotesById, removeArticleById, fetchAllArticles } = require('../models/articles_model')

// ---------- Article By ID ---------- //

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
        .catch(next)
};

exports.deleteArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    removeArticleById(articleId).then(() => {
        res.status(204).send()
    })
        .catch(next)
};


// ---------- All Articles ---------- //

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles().then(articles => {
        res.status(200).send({ articles })
    })
        .catch(next)
};