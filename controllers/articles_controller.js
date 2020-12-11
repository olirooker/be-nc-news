const { fetchArticleById, updateArticleVotesById, removeArticleById, fetchAllArticles, addArticle } = require('../models/articles_model');
const { addCommentToArticleById } = require('../models/comments_model');
const { checkOrderQuery } = require('./utils')


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
    const voteChange = req.body.inc_votes;

    console.log(voteChange)

    if (voteChange === undefined) next({ status: 400, msg: 'No votes on the request!' })

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

// ---------- All Articles Controller ---------- //

exports.getAllArticles = (req, res, next) => {
    const { sort_by: sortBy, order, limit, username, topic } = req.query

    if (!checkOrderQuery(order)) {
        next({ status: 400, msg: 'Bad request: Invalid order query' })
    }
    else {
        fetchAllArticles(sortBy, order, limit, username, topic)
            .then(articles => {
                res.status(200).send({ articles })
            })
            .catch(next)
    }
};

exports.postArticle = (req, res, next) => {
    const newArticle = req.body;
    addArticle(newArticle).then(postedArticle => {
        res.status(201).send({ postedArticle })
    })
        .catch(next)
};