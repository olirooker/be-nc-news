const data = require('../data/index.js');
const { formatArticleData, formatCommentData, createArticleRef } = require("../utils/data-manipulation")

exports.seed = function (knex) {
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex.insert(data.topicData).into('topics').returning('*');
    })
    .then((topicRows) => {
      console.log(`inserted ${topicRows.length} topics`);
      return knex.insert(data.userData).into('users').returning('*');
    })
    .then((userRows) => {
      console.log(`inserted ${userRows.length} users`);
      const formattedArticleData = formatArticleData(data.articleData)
      return knex.insert(formattedArticleData).into('articles').returning('*');
    })
    .then((articleRows) => {
      console.log(`inserted ${articleRows.length} articles`);
      const articleRef = createArticleRef(articleRows)
      const formattedCommentsData = formatCommentData(data.commentData, articleRef)
      return knex.insert(formattedCommentsData).into('comments').returning('*');
    })
    .then((commentRows) => {
      console.log(`inserted ${commentRows.length} comments`);
    })
};
