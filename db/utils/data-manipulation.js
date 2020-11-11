// extract any functions you are using to manipulate your data, into this file
const articleRef = require("../seeds/seed")

const formatArticleData = (arrOfData) => {
    const formattedData = arrOfData.map(({ created_at, ...restOfArticle }) => {
        const newTimestamp = new Date(created_at)
        // could remove this variable and move into the object

        const newArticle = {
            ...restOfArticle,
            created_at: newTimestamp
            // created_at: new Date(created_at)
        }
        return newArticle
    })
    return formattedData
}

const createArticleRef = (articleData) => {
    const ref = {}
    articleData.forEach(article => {
        ref[article.title] = article.article_id
    })
    return ref
}

const formatCommentData = (commentData, articleRef) => {

    const formattedData = commentData.map(({ created_at, belongs_to, created_by, ...restOfData }) => {
        const newComment = {
            ...restOfData,
            article_id: articleRef[belongs_to],
            created_at: new Date(created_at),
            author: created_by
        }
        return newComment
    })
    return formattedData
}

module.exports = { formatArticleData, createArticleRef, formatCommentData }