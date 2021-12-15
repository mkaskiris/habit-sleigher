const { Pool } = require('pg');

let pool;

pool = new Pool()

module.exports = pool;

