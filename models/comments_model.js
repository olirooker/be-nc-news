const connection = require("../db/connection");
const articlesRouter = require("../routers/articles_router");


// ---------- Comments By Article ID ---------- //

exports.fetchCommentsForArticle = (sortBy = 'created_at', order = 'desc', articleId) => {

    return connection
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .from('comments')
        .where('article_id', '=', articleId)
        .orderBy(sortBy, order)
        .then(commentsRows => {
            return commentsRows
        })
};