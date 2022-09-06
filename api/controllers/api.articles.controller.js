const { fetchArticlebyId } = require("../models/api.articles.models");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticlebyId(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  };
  