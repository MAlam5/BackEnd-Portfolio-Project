const users = require("../../db/data/test-data/users");
const { fetchArticlebyId, updateArticle } = require("../models/api.articles.models");

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
  updateArticle(articleId, body).then((article) => {
    res.status(200).send({ article });
  }).catch(next)
};
