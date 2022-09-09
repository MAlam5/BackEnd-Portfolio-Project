const users = require("../../db/data/test-data/users");
const {
  fetchArticlebyId,
  updateArticle,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
} = require("../models/api.articles.models");

exports.getArticles = async (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  try {
    const articles = await fetchArticles(topic, sort_by, order);

    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const article = await fetchArticlebyId(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  try {
  const article = await updateArticle(articleId, body);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  const articleId = req.params.article_id;
  try {
    const comments = await fetchCommentsByArticleId(articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  try {
    const postedComment = await addCommentByArticleId(articleId, body);
    res.status(201).send({ postedComment });
  } catch (err) {
    next(err);
  }
};
