const data = require('../data/index.js');

exports.seed = function (knex) {
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => {
      console.log('helloooo!')
      return knex.migrate.latest();
    })
    .then(() => {
      console.log(data.topicData)
      return knex.insert(data.topicData).into('topics').returning('*');
    })
    .then((topicRows) => {
      console.log(`inserted ${topicRows.length} topics`);
      // return connection.insert(data.userData).into('users').returning('*');
    })
  // .then((userRows) => {
  //   console.log(`inserted ${userRows.length} users`);
  // })

};
