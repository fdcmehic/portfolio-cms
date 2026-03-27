require('dotenv').config({ quiet: true });
let { Pool } = require('pg');

let pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio_cms',
    password: process.env.DB_PASSWORD,
    port: '5432'
});

module.exports = pool;