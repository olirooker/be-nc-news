const { fetchArticleById, updateArticleVotesById, removeArticleById, fetchAllArticles } = require('../models/articles_model')
const { fetchUsersByUsername } = require('../models/users_model')


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
    const voteChange = req.body.votes;

    // how can I do this with only one catch block?

    if (voteChange === undefined) return Promise.reject({ status: 400, msg: 'No votes on the request!' })
        .catch(next)

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

    const sortBy = req.query.sort_by
    const order = req.query.order
    const username = req.query.username
    const topic = req.query.topic

    // console.log(order, 'controller')

    fetchUsersByUsername(username)
        .then(username => {
            const user = username[0]?.username
            return fetchAllArticles(sortBy, order, user, topic)
        })
        .then(articles => {
            res.status(200).send({ articles })
        })
        .catch(next)
};

