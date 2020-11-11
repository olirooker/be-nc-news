const connection = require("../db/connection")

exports.fetchArticleById = (articleId) => {
    return connection
        .select('*')
        .from('articles')
        .where('article_id', '=', articleId)
        .then(articleRow => {
            return articleRow
            // some logic here to say if the articleRow.length === 0 then 404?

        })
}