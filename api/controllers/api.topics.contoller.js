const { fetchTopics } = require("../models/api.topics.model");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};
