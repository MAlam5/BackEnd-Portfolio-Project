const { application } = require("express");
const express = require("express");
const { getEndPoints } = require("./controllers/api.controller");
const { getArticleById, patchArticle, getArticles, getCommentsByArticleId, postCommentByArticleId } = require("./controllers/api.articles.controller");
const { deleteCommentById } = require("./controllers/api.comments.contoller");
const {
  getTopics,
} = require("./controllers/api.topics.contoller");
const { getUsers } = require("./controllers/api.users.contoller");
const { handleServerError, handleCustomError, handleSqlError } = require("./error_handlers/errors");

const app = express();

app.use(express.json())

app.get("/api",getEndPoints)

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app .get('/api/users',getUsers)

app.get('/api/articles',getArticles)

app.patch('/api/articles/:article_id', patchArticle)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments',postCommentByArticleId)

app.delete("/api/comments/:comment_id",deleteCommentById)

app.use(handleCustomError);

app.use(handleSqlError);

app.use(handleServerError);
module.exports = app;
