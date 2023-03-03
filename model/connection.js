const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'user_management',
  password: 'rohit',
  port: 5432,
})
module.exports= pool;