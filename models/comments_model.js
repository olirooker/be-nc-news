const connection = require("../db/connection");
const articlesRouter = require("../routers/articles_router");


// ---------- Comments By Article ID ---------- //

exports.fetchCommentsForArticle = (sortBy = 'created_at', order = 'desc', articleId) => {

    // console.log(order, '<<<<<< model')
    return connection
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .from('comments')
        .where('article_id', '=', articleId)
        .orderBy(sortBy, order)
        .then(commentsRows => {
            return commentsRows
        })
};

exports.addCommentToArticleById = (username, body, articleId) => {

    if (body === undefined) {
        return Promise.reject({ status: 400, msg: 'No body on the request!' })
    }
    else {
        const commentBuilder = {
            author: username[0].username,
            article_id: articleId,
            created_at: new Date(),
            body: body
        }

        return connection
            .insert(commentBuilder)
            .into('comments')
            .returning('*')
            .then(postedComment => {
                return postedComment
            })
    }


    // const commentBuilder = {
    //     author: username[0].username,
    //     article_id: articleId,
    //     created_at: new Date(),
    //     body: body
    // }

    // return connection
    //     .insert(commentBuilder)
    //     .into('comments')
    //     .returning('*')
    //     .then(postedComment => {
    //         return postedComment
    //     })
};