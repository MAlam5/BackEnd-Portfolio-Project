const db = require("../../db/connection");

exports.fetchArticlebyId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((article) => {
      if (article.rows.length === 0)
        return Promise.reject({ status: 404, msg: "bad request" });
      return article.rows[0];
    });
};

exports.updateArticle = (articleId, body) => {
  if (Object.keys(body).length !== 1 && !body.hasOwnProperty("inc_votes")) {
    return Promise.return({ status: 400, msg: "bad request" });
  }
  const newVotes = body.inc_votes;
  return db
    .query(
      "UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *",
      [newVotes, articleId]
    )

    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return article.rows[0];
    });
};
