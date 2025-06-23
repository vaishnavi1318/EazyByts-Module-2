const fs = require('fs');
const path = require('path');
const db = require('./database');

async function runSQLScript() {
  try {
    const sqlFilePath = path.join(__dirname, '../../../database/setup.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');
    await db.query(sql);
    console.log('✅ setup.sql executed successfully');
  } catch (err) {
    console.error('❌ Failed to execute setup.sql:', err.message);
  } finally {
    db.end();
  }
}

runSQLScript();