const connection = require("../db/connection");


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

    if (body === undefined || username === undefined) {
        return Promise.reject({ status: 400, msg: 'Missing information on the request!' })
    }
    else {
        const commentBuilder = {
            author: username,
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
};



// ---------- Comments Endpoints ---------- //

exports.updateCommentVotesById = (commentId, votesToAdd) => {
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', '=', commentId)
        .increment('votes', votesToAdd.inc_votes)
        .returning('*')
        .then(updatedComment => {
            return updatedComment
        })
};

exports.removeCommentById = (commentId) => {
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', '=', commentId)
        .delete()
        .then(deleteCount => {
            if (deleteCount === 0) {
                return Promise.reject({ status: 404, msg: 'Comment not found! Cannot delete.' })
            }
        })
};