const connection = require("../db/connection");
const articlesRouter = require("../routers/articles_router");

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
            return articleRow
            // some logic here to say if the articleRow.length === 0 then 404?
            // if (articleRow.length === 0) {
            //  return Promise.reject(send404)    
            // }
            // else return articleRow
            // or something similar but we want the middleware to handle the custom error.
            // do the same for any custom 404 for something not found
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
        .increment('votes', voteChange.votes)
        .returning('*')
        .then(updatedArticle => {
            return updatedArticle
        })

    // .update(increaseVoteByOne)
};