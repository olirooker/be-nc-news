
exports.up = function (knex) {
    console.log('creating comments table...');
    return knex.schema.createTable('comments', (commentsTable) => {
        commentsTable.increments('comment_id').primary();
        commentsTable.text('author').references('username').inTable('users').notNullable();
        commentsTable.integer('article_id').references('article_id').inTable('articles').onDelete('CASCADE');
        commentsTable.integer('votes').defaultTo(0);
        commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
        commentsTable.text('body');
    })
};

exports.down = function (knex) {
    console.log('dropping comments table...');
    return knex.schema.dropTable('comments');
};
