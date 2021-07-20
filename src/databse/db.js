const config = require('config');

const knex = require('knex')({
  client: config.DB_CLIENT,
  connection: {
    host : config.DB_HOST,
    user : config.DB_USER,
    password : config.DB_PASSWORD,
    database : config.DB_NAME
  }
});
module.exports = knex;