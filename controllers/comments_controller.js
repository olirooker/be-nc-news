const { fetchCommentsForArticle, addCommentToArticleById, updateCommentVotesById, removeCommentById } = require('../models/comments_model');
const { fetchUsersByUsername } = require('../models/users_model');


// ---------- Comments By Article ID ---------- //

exports.getCommentsForArticle = (req, res, next) => {
    const articleId = req.params.article_id
    const sortBy = req.query.sort_by
    const order = req.query.order

    // console.log(order, '<<<<< controller')

    // if (order !== 'asc' || order !== 'desc' || order !== undefined) return Promise.reject({ status: 400, msg: 'Invalid order request' })
    //     .catch(next)

    fetchCommentsForArticle(sortBy, order, articleId).then(comments => {
        res.status(200).send({ comments })
    })
        .catch(next)
};

exports.postCommentToArticleById = (req, res, next) => {

    const articleId = req.params.article_id
    const username = req.body.username
    const body = req.body.body

    // fetchUsersByUsername(username)
    //     .then(username => {

    addCommentToArticleById(username, body, articleId)
        .then(postedComment => {
            res.status(201).send({ postedComment })
        })
        .catch(next)

    // })
    // .catch (next)
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