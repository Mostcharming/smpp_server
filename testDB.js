const pool = require('./src/database')

async function testConnection () {
  let conn
  try {
    conn = await pool.getConnection()
    console.log('Successfully connected to the database!')

    // You can also run a simple query to test
    const rows = await conn.query('SELECT 1 AS test')
    console.log(rows)
  } catch (err) {
    console.error('Error connecting to the database:', err)
  } finally {
    if (conn) conn.release() // Ensure the connection is released back to the pool
  }
}

testConnection()
