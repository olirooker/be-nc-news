const { fetchArticleById } = require('../models/articles_model')

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    fetchArticleById(articleId).then(article => {
        res.status(200).send({ article })
    })
        .catch(next)
};

exports.patchArticleVotesById = (req, res, next) => {
    const article_id = req.params.article_id;
    const increaseVoteByOne = req.body;

    console.log(article_id, '<<<<< params article_id')
    console.log(increaseVoteByOne, '<<<<< req body')
};