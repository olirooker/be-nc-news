-- file to help build up the correct knex syntax.


-- GET request for articles by article Id
-- need to comment_count from comments table

-- comment_count - comments has an article_id, count the article_id

-- comment_count is the total count of all the
-- comments with this article_id

\c nc_news_test;
-- this database as it has been seeded with data.

SELECT articles.*, COUNT(comments.article_id) AS comment_count  FROM articles
JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id;

-- END of query builder