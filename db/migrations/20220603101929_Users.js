/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table){
        table.increments()
        table.string('name', 30).notNullable()
        table.string('email', 50).notNullable()
        table.string('bio', 160).defaultTo("")
        table.string('picture_url').defaultTo("")
        table.specificType('list_users', 'text array')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
