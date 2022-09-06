const db = require("../../db/connection");

exports.fetchArticlebyId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((article) => {
      if(article.rows.length === 0 )return Promise.reject({status:400, msg: 'bad request'})
      return article.rows[0];
    });
};