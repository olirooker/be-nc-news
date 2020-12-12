const { fetchCommentsForArticle, addCommentToArticleById, updateCommentVotesById, removeCommentById } = require('../models/comments_model');
const { checkOrderQuery } = require('./utils')

// ---------- Comments By Article ID ---------- //

exports.getCommentsForArticle = (req, res, next) => {
    const articleId = req.params.article_id
    const { sort_by: sortBy, order, limit } = req.query

    if (!checkOrderQuery(order)) {
        next({ status: 400, msg: 'Bad request: Invalid order query' })
    }
    else {
        fetchCommentsForArticle(sortBy, order, limit, articleId).then(comments => {
            res.status(200).send({ comments })
        })
            .catch(next)
    }
};

exports.postCommentToArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    const { username, body } = req.body
    addCommentToArticleById(username, body, articleId)
        .then(comment => {
            res.status(201).send({ comment })
        })
        .catch(next)
};



// ---------- Comments Endpoints ---------- //

exports.patchCommentVotesById = (req, res, next) => {
    const commentId = req.params.comment_id
    const votesToAdd = req.body
    updateCommentVotesById(commentId, votesToAdd).then(comment => {
        res.status(201).send({ comment })
    })
        .catch(next)
};

exports.deleteCommentById = (req, res, next) => {
    const commentId = req.params.comment_id
    removeCommentById(commentId).then(() => {
        res.status(204).send()
    })
        .catch(next)
};