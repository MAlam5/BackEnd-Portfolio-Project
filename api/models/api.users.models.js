const db = require("../../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = async (username)=>{
  const res = await db.query('SELECT * FROM users WHERE username = $1', [username])
  if(res.rows.length === 0) return Promise.reject({ status:404, msg:'user not found'})
  return res.rows[0]
}