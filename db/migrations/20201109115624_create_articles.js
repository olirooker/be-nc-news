
exports.up = function (knex) {
    console.log('creating articles table...');
    return knex.schema.createTable('articles', (articlesTable) => {
        articlesTable.increments('article_id').primary();
        articlesTable.text('title');
        articlesTable.text('body');
        articlesTable.integer('votes').defaultTo(0);
        articlesTable.text('topic').references('slug').inTable('topics').notNullable();
        articlesTable.text('author').references('username').inTable('users').notNullable();
        articlesTable.timestamp('created_at').defaultsTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    console.log('dropping articles table...');
    return knex.schema.dropTable('articles');
};
