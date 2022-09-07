const users = require("../../db/data/test-data/users");
const {
  fetchArticlebyId,
  updateArticle,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
} = require("../models/api.articles.models");

exports.getArticles = (req, res, next) => {
  const topicQuery = req.query.topic;
  return fetchArticles(topicQuery)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticlebyId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  updateArticle(articleId, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  return fetchCommentsByArticleId(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  return addCommentByArticleId(articleId, body)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};
