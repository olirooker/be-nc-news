
exports.up = function (knex) {
    console.log('creating articles table...');
    return knex.schema.createTable('articles', (articlesTable) => {
        articlesTable.increments('article_id').primary();
        articlesTable.text('title');
        articlesTable.text('body');
        articlesTable.integer('votes').defaultTo(0);
        articlesTable.text('topic').references('slug').inTable('topics');
        articlesTable.text('author').references('username').inTable('users');
        articlesTable.timestamp('created_at');
    })
};

exports.down = function (knex) {
    console.log('dropping articles table...');
    return knex.schema.dropTable('articles');
};
