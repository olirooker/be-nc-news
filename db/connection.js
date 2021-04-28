// const knex = require('knex');
// const dbConfig =
//     process.env.NODE_ENV === 'production'
//         ? { client: 'pg', connection: process.env.DATABASE_URL }
//         : require('../knexfile');

// const connection = knex(dbConfig);
// module.exports = connection;

const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');
const dbConfig =
  ENV === 'production'
    ? {
        client: 'pg',
        connection: {
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : require('../knexfile');
const connection = knex(dbConfig);
module.exports = connection;
