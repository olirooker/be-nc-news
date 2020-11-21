const connection = require("../db/connection");


// ---------- Comments By Article ID ---------- //

exports.fetchCommentsForArticle = (sortBy = 'created_at', order = 'desc', limit = 10, articleId) => {
    return connection
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .from('comments')
        .where('article_id', '=', articleId)
        .orderBy(sortBy, order)
        .limit(limit)
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
                return postedComment[0]
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
            return updatedComment[0]
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