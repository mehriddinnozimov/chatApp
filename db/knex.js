const env = process.env.NODE_ENV || 'development'
const config = require("../knexfile.js")[env]
const { attachPaginate } = require('knex-paginate');
attachPaginate();
module.exports = require('knex')(config)