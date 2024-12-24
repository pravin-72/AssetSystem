const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',      
  database: 'users_db',    
  password: 'abcd',     
  port: 5432,              
});

module.exports = pool;
