
exports.up = function (knex) {
    console.log('creating comments table...');
    return knex.schema.createTable('comments', (commentsTable) => {
        commentsTable.increments('comment_id').primary();
        commentsTable.text('author').references('users.username');
        commentsTable.integer('article_id').references('articles.article_id');
        commentsTable.integer('votes').defaultTo(0);
        commentsTable.timestamp('created_at');
        commentsTable.text('body');
    })
};

exports.down = function (knex) {
    console.log('dropping comments table...');
    return knex.schema.dropTable('comments');
};
