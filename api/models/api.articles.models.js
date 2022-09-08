const { query } = require("../../db/connection");
const db = require("../../db/connection");
const articles = require("../../db/data/test-data/articles");

exports.fetchArticlebyId = (article_id) => {
  return db
    .query(
      "SELECT articles.article_id, articles.author, articles.title,  articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.body) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
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

exports.fetchArticles = (topic, sortBy = "created_at", order = "DESC") => {
  const queryArr = [];
  const sortByArray = [
    "article_id",
    "author",
    "title",
    "body",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderArray = ["ASC","DESC"];
  if (!sortByArray.includes(sortBy) || !orderArray.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  let queryStr =
    "SELECT articles.article_id, articles.author, articles.title,  articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.body):: INT AS  comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";

  if (topic) {
    queryArr.push(topic);
    queryStr += ` WHERE articles.topic = $${queryArr.length}`;
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;

  return db
    .query(queryStr, queryArr)
    .then((articles) => {
      const promiseAll = [articles.rows];
      if (articles.rows.length === 0) {
        const checkTopicExists = db.query(
          "SELECT * FROM topics WHERE slug = $1",
          [topic]
        );
        promiseAll.push(checkTopicExists);
      }
      return Promise.all(promiseAll);
    })
    .then(([articles, checkTopicExists]) => {
      if (articles.length > 0) {
        return articles;
      }
      if (checkTopicExists.rows.length > 0) {
        return [];
      } else {
        return Promise.reject({
          status: 400,
          msg: "bad request",
        });
      }
    });
};

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      "SELECT comment_id, votes,created_at,author,body FROM comments WHERE article_id = $1",
      [articleId]
    )
    .then((comments) => {
      const promiseAll = [comments.rows];
      if (comments.rows.length === 0) {
        const checkArticleId = db.query(
          "SELECT * FROM articles WHERE article_id = $1",
          [articleId]
        );
        promiseAll.push(checkArticleId);
      }
      return Promise.all(promiseAll);
    })
    .then(([comments, checkArticleId]) => {
      if (comments.length > 0) return comments;

      if (checkArticleId.rows.length > 0) {
        return [];
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
