const { fetchCommentsForArticle } = require('../models/comments_model')


// ---------- Comments By Article ID ---------- //

exports.getCommentsForArticle = (req, res, next) => {
    const articleId = req.params.article_id
    const sortBy = req.query.sort_by
    const order = req.query.order

    if (order !== 'asc' || order !== 'desc') return Promise.reject({ status: 400, msg: 'Invalid order request' })
        .catch(next)

    fetchCommentsForArticle(sortBy, order, articleId).then(comments => {
        res.status(200).send({ comments })
    })
        .catch(next)
};