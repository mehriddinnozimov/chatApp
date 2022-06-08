/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('messages', function(table) {
        table.increments()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
        table.string('content').notNullable()
        table.string('file_url').defaultTo("")
        table.boolean('delevired').notNullable().defaultTo(false)
        table.integer('for').references('id').inTable('users')
        table.integer('from').references('id').inTable('users')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('messages')
};
