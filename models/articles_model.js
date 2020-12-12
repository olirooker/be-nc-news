const connection = require("../db/connection");
const { checkExists } = require('./utils')

// ---------- Articles By ID ---------- //

exports.fetchArticleById = (articleId) => {
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
            return articleRow[0]
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
            if (deleteCount === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found! Cannot delete.' })
            }
        })
};

// ---------- All Articles Model ---------- //

// .limit(limit) after order_by and limit=10 in the params

exports.fetchAllArticles = (sortBy = 'created_at', order = 'desc', user, topic) => {
    return connection
        .select('articles.author', 'title', 'articles.body', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
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
                return Promise.all([articlesRows, checkExists('users', 'username', user),
                    checkExists('topics', 'slug', topic)])
            }
            return [articlesRows];
        })
        .then((response) => {
            if (response[1] === true && response[2] === true) {
                return Promise.reject({ status: 404, msg: 'No articles yet!' })
            }
            else return response[0]
        })
};

exports.addArticle = (newArticle) => {
    if (newArticle.title === undefined ||
        newArticle.body === undefined) {
        return Promise.reject({ status: 400, msg: 'Missing information on the request!' })
    };

    const articleBuilder = {
        title: newArticle.title,
        body: newArticle.body,
        topic: newArticle.topic,
        author: newArticle.username
    };

    return connection
        .insert(articleBuilder)
        .into('articles')
        .returning('*')
        .then(article => {
            return article[0];
        })
};

