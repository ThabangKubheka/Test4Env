const sql = require("mssql");
const config = require('config');

const dbConfig = config.resourceApi.dbConfig;

async function fetchAllScores() {
  try {
    const pool = await sql.connect(dbConfig);
    const query =
      "SELECT username,wins, losses, ROUND(((wins*1.0/losses)*(wins+losses)),2) as score FROM Score ORDER BY score DESC";
    const request = new sql.Request();
    const result = await request.query(query);
    sql.close();
    return result.recordset;
  } catch (error) {
    throw error;
  }
}

async function postScore(username, state) {
    try {
      const pool = await sql.connect(dbConfig);
      let query;
    
      if (state === 'win') {
        query = `
          IF EXISTS (SELECT * FROM Score WHERE username = @username)
          BEGIN
            UPDATE Score SET wins = wins + 1 WHERE username = @username;
          END
          ELSE
          BEGIN
            INSERT INTO Score (username, wins, losses) VALUES (@username, 1, 0);
          END
        `;
      } else if (state === 'loss') {
        query = `
          IF EXISTS (SELECT * FROM Score WHERE username = @username)
          BEGIN
            UPDATE Score SET losses = losses + 1 WHERE username = @username;
          END
          ELSE
          BEGIN
            INSERT INTO Score (username, wins, losses) VALUES (@username, 0, 1);
          END
        `;
      } else {
        throw new Error('Invalid state provided');
      }
    
      const request = pool.request();
      request.input('username', sql.VarChar, username);
    
      const response = await request.query(query);
      sql.close();

      return response;
    } catch (error) {
      console.log('Original Error:', error);
      throw error;
  }
}

async function fetchUserScore(username){
    
  try {
    const pool = await sql.connect(dbConfig);
    const query = `SELECT username, wins, losses FROM score WHERE username =@username`;

    const request = pool.request();
    request.input('username', sql.VarChar, username);
    
    const result = await request.query(query);
    sql.close();
    return result.recordset;

} catch (error) {
    throw error;
}
}

module.exports = {
    fetchAllScores,
    postScore,
    fetchUserScore,
};