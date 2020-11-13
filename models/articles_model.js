const connection = require("../db/connection");
const articlesRouter = require("../routers/articles_router");

// ---------- Articles By ID ---------- //

exports.fetchArticleById = (articleId) => {
    // this has to be a leftJoin because otherwise
    // the database won't return any article without
    // comments.

    return connection
        .select('articles.*')
        .count('comments.article_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', articleId)
        .then(articleRow => {
            if (articleRow.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found!' })
            }
            return articleRow
        })
};

exports.updateArticleVotesById = (articleId, voteChange) => {
    return connection
        .select('articles.*')
        .count('comments.article_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', articleId)
        .increment('votes', voteChange)
        .returning('*')
        .then(updatedArticle => {
            return updatedArticle
        })
};

exports.removeArticleById = (articleId) => {
    return connection
        .select('*')
        .from('articles')
        .where('article_id', '=', articleId)
        .delete()
        .then(deleteCount => {
            // delete count returns a number
            if (deleteCount === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found! Cannot delete.' })
            }
        })
};



// ---------- All Articles ---------- //

exports.fetchAllArticles = (sortBy = 'created_at', order = 'desc', user, topic) => {

    console.log(user, '<<<<< username in model')

    return connection
        .select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
        .count('comments.article_id AS comment_count')
        .from('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .groupBy('articles.article_id')
        .modify(queryBuilder => {
            if (user) {
                queryBuilder.where('articles.author', '=', user)
            }
            if (topic) {
                queryBuilder.where('articles.topic', '=', topic)
            }
        })
        .orderBy(sortBy, order)
        .then(articlesRows => {
            if (articlesRows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found!' })
            }
            return articlesRows
        })
};

