const express = require("express");
const { getArticleById } = require("./controllers/api.articles.controller");
const {
  getTopics,
} = require("./controllers/api.topics.contoller");
const { handleServerError, handleCustomError, handleSqlError } = require("./error_handlers/errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handleCustomError);

app.use(handleSqlError);

app.use(handleServerError);
module.exports = app;
