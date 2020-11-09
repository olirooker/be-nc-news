
exports.up = function (knex) {
    console.log('creating topics table...');
    return knex.schema.createTable('topics', (topicsTable) => {
        topicsTable.text('slug').primary();
        topicsTable.text('description');
    })
};

exports.down = function (knex) {
    console.log('dropping topics table...');
    return knex.schema.dropTable('topics');
};
