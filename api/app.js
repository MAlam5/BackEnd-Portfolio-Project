const { application } = require("express");
const express = require("express");
const { getArticleById, patchArticle } = require("./controllers/api.articles.controller");
const {
  getTopics,
} = require("./controllers/api.topics.contoller");
const { getUsers } = require("./controllers/api.users.contoller");
const { handleServerError, handleCustomError, handleSqlError } = require("./error_handlers/errors");

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app .get('/api/users',getUsers)

app.patch('/api/articles/:article_id', patchArticle)

app.use(handleCustomError);

app.use(handleSqlError);

app.use(handleServerError);
module.exports = app;
